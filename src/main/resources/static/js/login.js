function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        btn.textContent = "🔒";
    } else {
        input.type = "password";
        btn.textContent = "👁️";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
        const username = form.querySelector("[name='username']").value.trim();
        const password = form.querySelector("[name='password']").value;

        if (username === "" || password === "") {
            e.preventDefault();
            alert("Please enter both username and password.");
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("error")) {
        alert("Invalid username or password. Please try again.");
    }
});
