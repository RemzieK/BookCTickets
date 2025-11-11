const root = document.getElementById('booking-root');
const movieId = Number(root.dataset.movieId);
const pricePerSeat = Number(root.dataset.pricePerSeat);

console.log('Movie ID:', movieId, 'Price per seat:', pricePerSeat);

const sideColumns = 4;
const centerColumns = 10;
const rows = 6;
const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

let selectedHour = null;
let reservedSeats = [];

function buildSeatGrid() {
    console.log('Building seat grid...');

    const seatGroups = [
        { selector: '.side-seats:first-child table', columns: sideColumns },
        { selector: '.center-seats table', columns: centerColumns },
        { selector: '.side-seats:last-child table', columns: sideColumns }
    ];

    let seatNumber = 1;

    seatGroups.forEach((group) => {
        const table = document.querySelector(group.selector);
        if (!table) {
            console.error('Table not found:', group.selector);
            return;
        }

        table.innerHTML = '';

        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        let headerRow = document.createElement('tr');
        headerRow.appendChild(document.createElement('td'));

        for (let i = 0; i < group.columns; i++) {
            let headerCell = document.createElement('td');
            headerCell.textContent = seatNumber;
            headerRow.appendChild(headerCell);
            seatNumber++;
        }
        seatNumber -= group.columns;

        thead.appendChild(headerRow);
        table.appendChild(thead);
        table.appendChild(tbody);

        for (let i = 0; i < rows; i++) {
            let bodyRow = document.createElement('tr');

            let labelCell = document.createElement('td');
            labelCell.textContent = rowLetters[i];
            bodyRow.appendChild(labelCell);

            for (let j = 0; j < group.columns; j++) {
                let cell = document.createElement('td');
                let button = document.createElement('button');
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
    });

    setupSeatSelection();
    console.log('Seat grid built successfully');
}

function setupSeatSelection() {
    document.querySelectorAll('.seat-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (!selectedHour) {
                alert('Please select a time first.');
                return;
            }

            const seatId = button.dataset.seat;

            if (button.classList.contains('occupied')) {
                alert(`Seat ${seatId} is already booked for ${selectedHour}`);
                return;
            }

            if (!button.classList.contains('occupied')) {
                button.classList.toggle('selected');
                button.classList.toggle('not-selected');
                updateSelectionSummary();
            }
        });
    });
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

function setupHourButtons() {
    document.querySelectorAll('.hour-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            console.log('Hour clicked:', btn.dataset.hour);

            document.querySelectorAll('.hour-btn').forEach(b => {
                b.classList.remove('active');
                b.style.backgroundColor = '';
                b.style.color = '';
            });

            btn.classList.add('active');
            btn.style.backgroundColor = '#FFFFFA';
            btn.style.color = '#2b99b1';

            selectedHour = btn.dataset.hour;

            clearAllSelections();

            await loadOccupiedSeats();
        });
    });
}

async function loadOccupiedSeats() {
    if (!selectedHour) return;

    console.log('Loading occupied seats for hour:', selectedHour);

    try {
        const resp = await fetch(`/reservation/${movieId}/occupied-seats?hour=${encodeURIComponent(selectedHour)}`);
        if (!resp.ok) throw new Error('Failed to load occupied seats');

        const occupiedSeats = await resp.json();
        console.log('Occupied seats for', selectedHour + ':', occupiedSeats);

        document.querySelectorAll('.seat-btn.occupied').forEach(seat => {
            seat.classList.remove('occupied');
            seat.classList.add('not-selected');
            seat.disabled = false;
        });

        occupiedSeats.forEach(seat => markAsOccupied(seat));
    } catch (e) {
        console.error('Error loading occupied seats:', e);
        alert('An error occurred while fetching occupied seats.');
    }
}

function updateSelectionSummary() {
    const selected = Array.from(document.querySelectorAll('.seat-btn.selected')).map(b => b.dataset.seat);
    const total = selected.length * pricePerSeat;

    document.getElementById('selected-seats').textContent = selected.length
        ? `Selected seats: ${selected.join(', ')}`
        : '';

    document.getElementById('total-price').textContent = selected.length
        ? `Total price: $${total.toFixed(2)}`
        : '';

    document.getElementById('reserve-btn').style.display = selected.length > 0 ? 'inline-block' : 'none';
}

document.getElementById('show-seats').addEventListener('click', () => {
    if (!selectedHour) {
        alert('Please select a time first.');
        return;
    }
    updateSelectionSummary();
});

document.getElementById('reserve-btn').addEventListener('click', async () => {
    if (!selectedHour) {
        alert('Please select a time first.');
        return;
    }

    const selected = Array.from(document.querySelectorAll('.seat-btn.selected')).map(b => b.dataset.seat);

    if (selected.length === 0) {
        alert('Please select seats.');
        return;
    }

    try {
        console.log('Reserving seats:', selected, 'for hour:', selectedHour);

        const resp = await fetch(`/reservation/${movieId}/reserve-seats?hour=${encodeURIComponent(selectedHour)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selected)
        });

        const result = await resp.json();
        console.log('Reservation response:', result);

        if (resp.status === 409) {
            alert(result.message);
            await loadOccupiedSeats();
            clearAllSelections();
            return;
        }

        if (!resp.ok) {
            throw new Error(result.message || 'Reservation failed');
        }

        reservedSeats = selected;
        document.getElementById('paymentSection').style.display = 'block';
        document.getElementById('reserve-btn').style.display = 'none';

        selected.forEach(seatId => {
            const seat = document.querySelector(`button[data-seat="${seatId}"]`);
            if (seat) {
                seat.classList.add('occupied');
                seat.classList.remove('selected', 'not-selected');
                seat.disabled = true;
            }
        });

        alert('Seats reserved temporarily! Please complete payment within 10 minutes.');

    } catch (e) {
        console.error('Reservation error:', e);
        alert('An error occurred while reserving the seats: ' + e.message);
    }
});

document.getElementById('buy-btn').addEventListener('click', async () => {
    if (!selectedHour || reservedSeats.length === 0) {
        alert('Please reserve seats first.');
        return;
    }

    const cardName = document.querySelector('[name="cardName"]').value.trim();
    const cardNumber = document.querySelector('[name="cardNumber"]').value.trim();
    const expiry = document.querySelector('[name="expiry"]').value.trim();
    const cvc = document.querySelector('[name="cvc"]').value.trim();

    if (!cardName || !cardNumber || !expiry || !cvc) {
        alert('Please complete the payment form.');
        return;
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleanCardNumber)) {
        alert('Please enter a valid card number (13-19 digits).');
        return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert('Please enter expiry date in MM/YY format.');
        return;
    }

    if (!/^\d{3,4}$/.test(cvc)) {
        alert('Please enter a valid CVC (3-4 digits).');
        return;
    }

    try {
        const paymentData = {
            cardName,
            cardNumber: cleanCardNumber,
            expiry,
            cvc,
            seats: reservedSeats
        };

        console.log('Processing payment for seats:', reservedSeats, 'at hour:', selectedHour);

        const resp = await fetch(`/reservation/${movieId}/confirm-payment?hour=${encodeURIComponent(selectedHour)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        });

        const result = await resp.json();
        console.log('Payment response:', result);

        if (!resp.ok) {
            alert(result.message || 'Payment failed.');
            return;
        }

        alert('Payment successful! Your booking is confirmed.\nYou will be redirected to the movies page.');

        const lastFour = cardNumber.slice(-4);
        alert(`Booking confirmed!\nSeats: ${reservedSeats.join(', ')}\nTime: ${selectedHour}\nCard: **** **** **** ${lastFour}`);

        setTimeout(() => {
            window.location.href = '/movies';
        }, 2000);

    } catch (e) {
        console.error('Payment error:', e);
        alert('Payment failed due to a network error. Please try again.');
    }
});

function clearPaymentForm() {
    document.querySelector('[name="cardName"]').value = '';
    document.querySelector('[name="cardNumber"]').value = '';
    document.querySelector('[name="expiry"]').value = '';
    document.querySelector('[name="cvc"]').value = '';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        clearAllSelections();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing booking page...');

    buildSeatGrid();
    setupHourButtons();

    setTimeout(() => {
        const firstHourBtn = document.querySelector('.hour-btn');
        if (firstHourBtn) {
            console.log('Auto-selecting first hour:', firstHourBtn.dataset.hour);
            firstHourBtn.click();
        } else {
            console.log('No hour buttons found');
        }
    }, 100);
});

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        buildSeatGrid,
        setupHourButtons,
        loadOccupiedSeats,
        updateSelectionSummary,
        clearAllSelections
    };
}