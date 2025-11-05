var showtimeId = 4;
let sideColumns = 4;
let centerColumns = 10;
let rows = 6;
const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
const seatGroups = [
  { selector: '.side-seats:first-child table', columns: sideColumns },
  { selector: '.center-seats table', columns: centerColumns },
  { selector: '.side-seats:last-child table', columns: sideColumns }
];

let seatNumber = 1;

seatGroups.forEach((group) => {
  const thead = document.querySelector(`${group.selector} thead`);
  const tbody = document.querySelector(`${group.selector} tbody`);

  let headerRow = thead.insertRow();
  headerRow.insertCell();
  for (let i = 0; i < group.columns; i++) {
    headerRow.insertCell().innerHTML = seatNumber;
    seatNumber++;
  }

  seatNumber -= group.columns;

  for (let i = 0; i < rows; i++) {
    let bodyRow = tbody.insertRow();
    bodyRow.insertCell().innerHTML = rowLetters[i];
    for (let j = 0; j < group.columns; j++) {
      let cell = bodyRow.insertCell();
      let button = document.createElement('button');
      button.className = 'seat-btn not-selected';
      button.dataset.seat = `${rowLetters[i]}${seatNumber}`;
      button.innerHTML = `<i class="material-icons">event_seat</i><br>${rowLetters[i]}${seatNumber}`;
      cell.appendChild(button);

      button.addEventListener('click', () => {
        if (!button.classList.contains('occupied')) {
          button.classList.toggle('selected');
          button.classList.toggle('not-selected');
        }
      });

      seatNumber++;
    }

    seatNumber -= group.columns;
  }

  seatNumber += group.columns;
});

getOccupiedSeats(showtimeId);

function markAsOccupied(seatId) {
  const seat = document.querySelector(`button[data-seat="${seatId}"]`);
  if (seat) {
    seat.classList.add('occupied');
    seat.classList.remove('selected', 'not-selected');
    seat.disabled = true;
  } else {
    console.error('Seat not found:', seatId);
  }
}

let pricePerSeat = 10;

document.querySelector('#show-seats').addEventListener('click', () => {
  let selectedSeats = [];
  document.querySelectorAll('.selected').forEach(btn => {
    selectedSeats.push(btn.dataset.seat);
  });
  let total = selectedSeats.length * pricePerSeat;
  document.getElementById('selected-seats').textContent = `Selected seats: ${selectedSeats.join(', ')}`;
  document.getElementById('total-price').textContent = `Total price: $${total.toFixed(2)}`;
  document.getElementById('reserve-btn').style.display = 'inline-block';
});

let selectedSeats = [];

document.querySelector('#reserve-btn').addEventListener('click', () => {
  selectedSeats = [];
  document.querySelectorAll('.selected').forEach(btn => {
    selectedSeats.push(btn.dataset.seat);
    btn.classList.add('occupied');
    btn.classList.remove('selected');
    btn.disabled = true;
  });

  alert(`Reservation made for seats: ${selectedSeats.join(', ')}`);
  document.getElementById('selected-seats').textContent = '';
  document.getElementById('total-price').textContent = '';
  document.getElementById('reserve-btn').style.display = 'none';

  sendSelectedSeats(showtimeId);
});

async function sendSelectedSeats(showtimeId) {
  const jwtToken = localStorage.getItem("jwtToken");

  if (selectedSeats.length === 0) {
    alert('You have not selected any seats.');
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/user/reservation/${showtimeId}/add-seats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify(selectedSeats)
    });

    if (!response.ok) {
      throw new Error('Error sending seats.');
    }

    const result = await response.json();

    if (result.message) {
      alert(result.message);
      selectedSeats.forEach(seat => markAsOccupied(seat));
      await getOccupiedSeats(showtimeId);
    } else {
      alert('There was a problem reserving the seats.');
    }

  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while reserving the seats.');
  }
}

async function getOccupiedSeats(showtimeId) {
  const jwtToken = localStorage.getItem("jwtToken");

  try {
    const response = await fetch(`http://localhost:8080/user/reservation/${showtimeId}/occupied-seats`, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Error fetching occupied seats.');
    }

    const occupiedSeats = await response.json();
    occupiedSeats.forEach(seat => markAsOccupied(seat));

  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while fetching occupied seats.');
  }
}
