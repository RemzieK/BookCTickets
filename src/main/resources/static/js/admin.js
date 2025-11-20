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
function openInfoModal(data) {
    const modal = document.getElementById('infoMovieModal');

    modal.querySelector('#info-title').value = data.title;
    modal.querySelector('#info-description').value = data.description;
    modal.querySelector('#info-director').value = data.director;
    modal.querySelector('#info-actors').value = data.actors;
    modal.querySelector('#info-genre').value = data.genre;
    modal.querySelector('#info-duration').value = data.duration;
    modal.querySelector('#info-ticketPrice').value = data.ticketPrice;
    modal.querySelector('#info-hours').value = data.hours;
    modal.querySelector('#info-room').value = data.room;
    modal.querySelector('#info-language').value = data.language;
    modal.querySelector('#info-ageRestriction').value = data.ageRestriction;

    const img = modal.querySelector('#info-image');
    if(data.imageUrl){
        img.src = data.imageUrl;
        img.style.display = 'block';
    } else {
        img.style.display = 'none';
    }

    modal.style.display = 'block';
}

function openEditModal(data) {
    const modal = document.getElementById('editMovieModal');

    modal.querySelector('#edit-id').value = data.id;
    modal.querySelector('#edit-title').value = data.title;
    modal.querySelector('#edit-description').value = data.description;
    modal.querySelector('#edit-director').value = data.director;
    modal.querySelector('#edit-actors').value = data.actors;
    modal.querySelector('#edit-genre').value = data.genre;
    modal.querySelector('#edit-duration').value = data.duration;
    modal.querySelector('#edit-ticketPrice').value = data.ticketPrice;
    modal.querySelector('#edit-hours').value = data.hours;
    modal.querySelector('#edit-room').value = data.room;
    modal.querySelector('#edit-language').value = data.language;
    modal.querySelector('#edit-ageRestriction').value = data.ageRestriction;
    modal.querySelector('#edit-existingImageUrl').value = data.imageUrl;

    const img = modal.querySelector('#edit-image-preview');
    if(data.imageUrl){
        img.src = data.imageUrl;
        img.style.display = 'block';
    } else {
        img.style.display = 'none';
    }

    modal.style.display = 'block';
}
function previewEditImage(event){
    const img = document.getElementById('edit-image-preview');
    img.src = URL.createObjectURL(event.target.files[0]);
    img.style.display = 'block';
}
function showInfo(button) {
    const row = button.closest('tr');
    openInfoModal(row.dataset);
}

function showEdit(button) {
    const row = button.closest('tr');
    openEditModal(row.dataset);
}
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if(tab) {
        openTab(tab);
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const MAX_SIZE_MB = 10;
    const fileInputs = document.querySelectorAll('input[type="file"][name="imageFile"]');

    fileInputs.forEach(input => {
        input.addEventListener('change', event => {
            const file = event.target.files[0];
            if (file && file.size > MAX_SIZE_MB * 1024 * 1024) {
                showUploadError(`File too large! Please select an image smaller than ${MAX_SIZE_MB} MB.`);
                event.target.value = "";
            }
        });
    });
});

function showUploadError(message) {
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

    setTimeout(() => {
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 300);
    }, 4000);
}
