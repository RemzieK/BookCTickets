const root = document.getElementById('booking-root');
const movieId = Number(root.dataset.movieId);
const pricePerSeat = Number(root.dataset.pricePerSeat);

const sideColumns = 4;
const centerColumns = 10;
const rows = 6;
const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

let selectedHour = null;
let reservedSeats = [];

document.addEventListener('DOMContentLoaded', () => {
    buildSeatGrid();
    setupHourButtons();
    // Auto-select first hour
    setTimeout(() => document.querySelector('.hour-btn')?.click(), 100);
});

// Build the seat grid
function buildSeatGrid() {
    const seatGroups = [
        { selector: '.side-seats:first-child table', columns: sideColumns },
        { selector: '.center-seats table', columns: centerColumns },
        { selector: '.side-seats:last-child table', columns: sideColumns }
    ];

    let seatNumber = 1;
    seatGroups.forEach(group => {
        const table = document.querySelector(group.selector);
        if (!table) return;
        table.innerHTML = '';

        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        let headerRow = document.createElement('tr');
        headerRow.appendChild(document.createElement('td')); // empty top-left cell

        for (let i = 0; i < group.columns; i++) {
            const cell = document.createElement('td');
            cell.textContent = seatNumber++;
            headerRow.appendChild(cell);
        }
        seatNumber -= group.columns;
        thead.appendChild(headerRow);
        table.appendChild(thead);

        for (let i = 0; i < rows; i++) {
            const bodyRow = document.createElement('tr');
            const labelCell = document.createElement('td');
            labelCell.textContent = rowLetters[i];
            bodyRow.appendChild(labelCell);

            for (let j = 0; j < group.columns; j++) {
                const cell = document.createElement('td');
                const button = document.createElement('button');
                const seatId = `${rowLetters[i]}${seatNumber}`;
                button.className = 'seat-btn not-selected';
                button.dataset.seat = seatId;
                button.innerHTML = `<i class="material-icons">event_seat</i><br>${seatId}`;
                cell.appendChild(button);
                bodyRow.appendChild(cell);
                seatNumber++;
            }
            seatNumber -= group.columns;
            tbody.appendChild(bodyRow);
        }
        seatNumber += group.columns;
        table.appendChild(tbody);
    });

    setupSeatSelection();
}

// Handle seat selection
function setupSeatSelection() {
    document.querySelectorAll('.seat-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (!selectedHour) {
                alert('Please select a time first.');
                return;
            }
            if (button.classList.contains('occupied')) return;
            button.classList.toggle('selected');
            button.classList.toggle('not-selected');
            updateSelectionSummary(); // **live update**
        });
    });
}

// Update selected seats and price
function updateSelectionSummary() {
    const selected = Array.from(document.querySelectorAll('.seat-btn.selected')).map(b => b.dataset.seat);
    const total = selected.length * pricePerSeat;
    document.getElementById('selected-seats').textContent = selected.length
        ? `Selected seats: ${selected.join(', ')}`
        : '';
    document.getElementById('total-price').textContent = selected.length
        ? `Total price: $${total.toFixed(2)}`
        : '';
    document.getElementById('reserve-btn').style.display = selected.length ? 'inline-block' : 'none';
}

// Hour selection buttons
function setupHourButtons() {
    document.querySelectorAll('.hour-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            selectedHour = btn.dataset.hour;
            document.querySelectorAll('.hour-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            clearAllSelections();
            await loadOccupiedSeats();
        });
    });
}

// Load occupied seats from server
async function loadOccupiedSeats() {
    if (!selectedHour) return;
    try {
        const resp = await fetch(`/reservation/${movieId}/occupied-seats?hour=${encodeURIComponent(selectedHour)}`);
        const occupiedSeats = await resp.json();
        document.querySelectorAll('.seat-btn.occupied').forEach(seat => {
            seat.classList.remove('occupied');
            seat.classList.add('not-selected');
            seat.disabled = false;
        });
        occupiedSeats.forEach(markAsOccupied);
    } catch (e) {
        console.error(e);
        alert('Error loading occupied seats.');
    }
}

function markAsOccupied(seatId) {
    const seat = document.querySelector(`button[data-seat="${seatId}"]`);
    if (seat) {
        seat.classList.add('occupied');
        seat.classList.remove('selected', 'not-selected');
        seat.disabled = true;
    }
}

function clearAllSelections() {
    document.querySelectorAll('.seat-btn').forEach(button => {
        if (!button.classList.contains('occupied')) {
            button.classList.remove('selected');
            button.classList.add('not-selected');
            button.disabled = false;
        }
    });
    reservedSeats = [];
    document.getElementById('selected-seats').textContent = '';
    document.getElementById('total-price').textContent = '';
    document.getElementById('reserve-btn').style.display = 'none';
    document.getElementById('paymentSection').style.display = 'none';
}

// Reserve seats
document.getElementById('reserve-btn').addEventListener('click', async () => {
    if (!selectedHour) return alert('Please select a time first.');
    const selected = Array.from(document.querySelectorAll('.seat-btn.selected')).map(b => b.dataset.seat);
    if (!selected.length) return alert('Please select seats.');

    try {
        const resp = await fetch(`/reservation/${movieId}/reserve-seats?hour=${encodeURIComponent(selectedHour)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selected)
        });
        const result = await resp.json();
        if (!resp.ok) throw new Error(result.message || 'Reservation failed');

        reservedSeats = selected;
        document.getElementById('paymentSection').style.display = 'block';
        document.getElementById('reserve-btn').style.display = 'none';

        selected.forEach(seatId => markAsOccupied(seatId));
        alert('Seats reserved temporarily! Please complete payment within 10 minutes.');
    } catch (e) {
        console.error(e);
        alert('Error reserving seats: ' + e.message);
    }
});

// Payment
document.getElementById('buy-btn').addEventListener('click', async () => {
    if (!selectedHour || !reservedSeats.length) return alert('Please reserve seats first.');

    const cardName = document.querySelector('[name="cardName"]').value.trim();
    const cardNumber = document.querySelector('[name="cardNumber"]').value.trim();
    const expiry = document.querySelector('[name="expiry"]').value.trim();
    const cvc = document.querySelector('[name="cvc"]').value.trim();
    if (!cardName || !cardNumber || !expiry || !cvc) return alert('Please complete the payment form.');

    try {
        const paymentData = { cardName, cardNumber, expiry, cvc, seats: reservedSeats };
        const resp = await fetch(`/reservation/${movieId}/confirm-payment?hour=${encodeURIComponent(selectedHour)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        });
        const result = await resp.json();
        if (!resp.ok) return alert(result.message || 'Payment failed.');

        alert('Payment successful! Booking confirmed.');
        setTimeout(() => window.location.href = '/movies', 2000);
    } catch (e) {
        console.error(e);
        alert('Payment failed due to network error.');
    }
});

// ESC clears selection
document.addEventListener('keydown', e => { if (e.key === 'Escape') clearAllSelections(); });
