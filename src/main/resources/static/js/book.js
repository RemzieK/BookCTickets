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

    setTimeout(() => document.querySelector('.hour-btn')?.click(), 100);

    setupPaymentModalControls();
    setupPaymentInputEnhancements();
});

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
        headerRow.appendChild(document.createElement('td'));

        for (let i = 0; i < group.columns; i++) {
            const cell = document.createElement('td');
            cell.textContent = seatNumber++;
            headerRow.appendChild(cell);
        }

        seatNumber -= group.columns;
        thead.appendChild(headerRow);
        table.appendChild(thead);

        for (let i = 0; i < rows; i++) {
            const row = document.createElement('tr');
            const label = document.createElement('td');
            label.textContent = rowLetters[i];
            row.appendChild(label);

            for (let j = 0; j < group.columns; j++) {
                const cell = document.createElement('td');
                const btn = document.createElement('button');
                const seatId = `${rowLetters[i]}${seatNumber}`;

                btn.className = 'seat-btn not-selected';
                btn.dataset.seat = seatId;
                btn.innerHTML = `<i class="material-icons">event_seat</i><br>${seatId}`;

                btn.addEventListener('click', () => handleSeatClick(btn));

                cell.appendChild(btn);
                row.appendChild(cell);

                seatNumber++;
            }
            seatNumber -= group.columns;
            tbody.appendChild(row);
        }
        seatNumber += group.columns;

        table.appendChild(tbody);
    });
}

function handleSeatClick(button) {
    if (!selectedHour) {
        alert('Please select a time first.');
        return;
    }
    if (button.classList.contains('occupied')) return;

    button.classList.toggle('selected');
    button.classList.toggle('not-selected');

    updateSelectionSummary();
}

function updateSelectionSummary() {
    const selected = Array.from(document.querySelectorAll('.seat-btn.selected'))
        .map(b => b.dataset.seat);

    const total = selected.length * pricePerSeat;

    document.getElementById('selected-seats').textContent =
        selected.length ? `Selected seats: ${selected.join(', ')}` : '';

    document.getElementById('total-price').textContent =
        selected.length ? `Total price: $${total.toFixed(2)}` : '';

    document.getElementById('reserve-btn').style.display =
        selected.length ? 'inline-block' : 'none';
}

function setupHourButtons() {
    const buttons = document.querySelectorAll('.hour-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', async () => {
            selectedHour = btn.dataset.hour;

            buttons.forEach(b => b.classList.remove('active-hour'));
            btn.classList.add('active-hour');

            clearAllSelections();
            await loadOccupiedSeats();
        });
    });
}

async function loadOccupiedSeats() {
    if (!selectedHour) return;

    try {
        const resp = await fetch(`/reservation/${movieId}/occupied-seats?hour=${encodeURIComponent(selectedHour)}`);
        const occupiedSeats = await resp.json();

        document.querySelectorAll('.seat-btn.occupied').forEach(btn => {
            btn.classList.remove('occupied');
            btn.classList.add('not-selected');
            btn.disabled = false;
        });

        occupiedSeats.forEach(id => markAsOccupied(id));
    } catch (e) {
        console.error(e);
        alert('Error loading seats.');
    }
}

function markAsOccupied(id) {
    const btn = document.querySelector(`button[data-seat="${id}"]`);
    if (!btn) return;

    btn.classList.remove('selected', 'not-selected');
    btn.classList.add('occupied');
    btn.disabled = true;
}

function clearAllSelections() {
    document.querySelectorAll('.seat-btn').forEach(btn => {
        if (!btn.classList.contains('occupied')) {
            btn.classList.remove('selected');
            btn.classList.add('not-selected');
            btn.disabled = false;
        }
    });

    reservedSeats = [];
    document.getElementById('selected-seats').textContent = '';
    document.getElementById('total-price').textContent = '';
    document.getElementById('reserve-btn').style.display = 'none';

    document.getElementById('paymentModal').style.display = 'none';
}

document.getElementById('reserve-btn').addEventListener('click', async () => {
    const selected = Array.from(document.querySelectorAll('.seat-btn.selected'))
        .map(b => b.dataset.seat);

    if (!selected.length) return alert('Select seats first.');
    if (!selectedHour) return alert('Select a time first.');

    try {
        const resp = await fetch(`/reservation/${movieId}/reserve-seats?hour=${encodeURIComponent(selectedHour)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selected)
        });

        const result = await resp.json();
        if (!resp.ok) throw new Error(result.message);

        reservedSeats = selected;

        document.getElementById('reserve-btn').style.display = 'none';

        selected.forEach(id => markAsOccupied(id));

        const resModal = document.getElementById('reservationModal');
        resModal.style.display = 'flex';

        document.getElementById('closeReservationModal').addEventListener('click', () => {
            resModal.style.display = 'none';
        });

        window.addEventListener('click', e => {
            if (e.target === resModal) resModal.style.display = 'none';
        });

        document.getElementById('goToPaymentBtn').addEventListener('click', () => {
            resModal.style.display = 'none';
            document.getElementById('paymentModal').style.display = 'flex';
        });

    } catch (e) {
        alert('Error: ' + e.message);
    }
});

document.getElementById('buy-btn').addEventListener('click', async () => {
    const cardName = document.querySelector('[name="cardName"]').value.trim();
    const cardNumber = document.querySelector('[name="cardNumber"]').value.replace(/\s/g, '');
    const expiry = document.querySelector('[name="expiry"]').value.trim();
    const cvc = document.querySelector('[name="cvc"]').value.trim();

    if (!cardName || !cardNumber || !expiry || !cvc)
        return alert('Fill out all fields.');

    if (!/^\d{16}$/.test(cardNumber))
        return alert('Card number must be exactly 16 digits.');

    if (!/^\d{2}\/\d{2}$/.test(expiry))
        return alert('Expiry must be in MM/YY format.');

    const [monthStr, yearStr] = expiry.split('/');
    const month = parseInt(monthStr, 10);
    let year = parseInt(yearStr, 10);

    if (month < 1 || month > 12)
        return alert('Invalid expiry month.');

    const currentFullYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    year += (year < 100 ? Math.floor(currentFullYear / 100) * 100 : 0);

    if (year < currentFullYear || (year === currentFullYear && month < currentMonth))
        return alert('Card has expired.');

    if (!/^\d{3,4}$/.test(cvc))
        return alert('Invalid CVC.');

    try {
        const paymentData = {
            cardName, cardNumber, expiry, cvc,
            seats: reservedSeats
        };

        const resp = await fetch(`/reservation/${movieId}/confirm-payment?hour=${encodeURIComponent(selectedHour)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        });

        const result = await resp.json();
        if (!resp.ok) throw new Error(result.message);

        showSuccessAnimation();

    } catch (e) {
        alert('Payment failed: ' + e.message);
    }
});

function setupPaymentModalControls() {
    const modal = document.getElementById('paymentModal');
    const closeBtn = document.getElementById('closeModal');

    closeBtn.addEventListener('click', () => modal.style.display = 'none');

    window.addEventListener('click', e => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') clearAllSelections();
});

function setupPaymentInputEnhancements() {
    const cardInput = document.querySelector('[name="cardNumber"]');
    const expiryInput = document.querySelector('[name="expiry"]');
    const cvcInput = document.querySelector('[name="cvc"]');

    cardInput.addEventListener('input', () => {
        let value = cardInput.value.replace(/\D/g, '').slice(0, 16);
        value = value.replace(/(.{4})/g, '$1 ').trim();
        cardInput.value = value;
        detectCardType(value.replace(/\s/g, ''));
    });

    expiryInput.addEventListener('input', () => {
        let v = expiryInput.value.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4);
        expiryInput.value = v;
    });

    cvcInput.addEventListener('input', () => {
        cvcInput.value = cvcInput.value.replace(/\D/g, '').slice(0, 4);
    });
}

function showSuccessAnimation() {
    const modal = document.getElementById('paymentModal');

    modal.innerHTML = `
        <div style="text-align:center; color:white;">
            <div class="success-checkmark">
                <div class="check-icon">
                    <span class="icon-line line-tip"></span>
                    <span class="icon-line line-long"></span>
                    <div class="icon-circle"></div>
                </div>
            </div>
            <h2>Payment Successful!</h2>
        </div>
    `;

    setTimeout(() => {
        modal.style.display = "none";
    }, 2000);
}

