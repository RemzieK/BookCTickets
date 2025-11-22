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