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