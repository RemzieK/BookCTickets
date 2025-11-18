function openModal(id) {
    document.getElementById(id).style.display = 'block';
}
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}
function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    document.querySelectorAll('.sidebar nav ul li').forEach(li => li.classList.remove('active'));
    document.querySelector(`.sidebar nav ul li[onclick="openTab('${tabName}')"]`).classList.add('active');
}

function openInfoModal(id, title, description, actors, genre, ticketPrice, hours, room, language, ageRestriction, imageUrl) {
    const modal = document.getElementById('infoMovieModal');
    modal.querySelector('#info-title').value = title;
    modal.querySelector('#info-description').value = description;
    modal.querySelector('#info-actors').value = actors;
    modal.querySelector('#info-genre').value = genre;
    modal.querySelector('#info-ticketPrice').value = ticketPrice;
    modal.querySelector('#info-hours').value = hours;
    modal.querySelector('#info-room').value = room;
    modal.querySelector('#info-language').value = language;
    modal.querySelector('#info-ageRestriction').value = ageRestriction;

    const img = modal.querySelector('#info-image');
    if(imageUrl){
        img.src = imageUrl;
        img.style.display = 'block';
    } else img.style.display = 'none';

    modal.style.display = 'block';
}

function openEditModal(id, title, description, actors, genre, ticketPrice, hours, room, language, ageRestriction, imageUrl) {
    const modal = document.getElementById('editMovieModal');
    modal.querySelector('#edit-id').value = id;
    modal.querySelector('#edit-title').value = title;
    modal.querySelector('#edit-description').value = description;
    modal.querySelector('#edit-actors').value = actors;
    modal.querySelector('#edit-genre').value = genre;
    modal.querySelector('#edit-ticketPrice').value = ticketPrice;
    modal.querySelector('#edit-hours').value = hours;
    modal.querySelector('#edit-room').value = room;
    modal.querySelector('#edit-language').value = language;
    modal.querySelector('#edit-ageRestriction').value = ageRestriction;
     modal.querySelector('#edit-existingImageUrl').value = imageUrl;

    const img = modal.querySelector('#edit-image-preview');
    if(imageUrl){
        img.src = imageUrl;
        img.style.display = 'block';
    } else img.style.display = 'none';

    modal.style.display = 'block';
}

function previewEditImage(event){
    const img = document.getElementById('edit-image-preview');
    img.src = URL.createObjectURL(event.target.files[0]);
    img.style.display = 'block';
}

function showInfo(button) {
    const row = button.closest('tr');
    openInfoModal(
        row.dataset.id,
        row.dataset.title,
        row.dataset.description,
        row.dataset.actors,
        row.dataset.genre,
        row.dataset.ticketPrice,
        row.dataset.hours,
        row.dataset.room,
        row.dataset.language,
        row.dataset.ageRestriction,
        row.dataset.imageUrl
    );
}

function showEdit(button) {
    const row = button.closest('tr');
    openEditModal(
        row.dataset.id,
        row.dataset.title,
        row.dataset.description,
        row.dataset.actors,
        row.dataset.genre,
        row.dataset.ticketPrice,
        row.dataset.hours,
        row.dataset.room,
        row.dataset.language,
        row.dataset.ageRestriction,
        row.dataset.imageUrl
    );
}
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if(tab) {
        openTab(tab);
    }
});
// Client-side file size check (e.g., 10MB limit)
document.addEventListener("DOMContentLoaded", () => {
    const MAX_SIZE_MB = 10;
    const fileInputs = document.querySelectorAll('input[type="file"][name="imageFile"]');

    fileInputs.forEach(input => {
        input.addEventListener('change', event => {
            const file = event.target.files[0];
            if (file && file.size > MAX_SIZE_MB * 1024 * 1024) {
                // Show a nice styled warning message
                showUploadError(`File too large! Please select an image smaller than ${MAX_SIZE_MB} MB.`);
                event.target.value = ""; // reset the file input
            }
        });
    });
});

// Display a popup-style error message at the top
function showUploadError(message) {
    // Remove old message if any
    const oldMsg = document.getElementById('upload-error-msg');
    if (oldMsg) oldMsg.remove();

    const msg = document.createElement('div');
    msg.id = 'upload-error-msg';
    msg.innerText = message;
    msg.style.position = 'fixed';
    msg.style.top = '20px';
    msg.style.left = '50%';
    msg.style.transform = 'translateX(-50%)';
    msg.style.background = 'linear-gradient(to right, #b00020, #ff4d4d)';
    msg.style.color = 'white';
    msg.style.padding = '12px 20px';
    msg.style.borderRadius = '8px';
    msg.style.fontWeight = 'bold';
    msg.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    msg.style.zIndex = '2000';
    msg.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(msg);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 300);
    }, 4000);
}
