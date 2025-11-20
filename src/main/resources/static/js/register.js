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

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = form.querySelector("[name='username']").value.trim();
        const firstName = form.querySelector("[name='firstName']").value.trim();
        const lastName = form.querySelector("[name='lastName']").value.trim();
        const email = form.querySelector("[name='email']").value.trim();
        const password = form.querySelector("[name='password']").value;

        let errors = [];

        if (username.length < 3) errors.push("Username must be at least 3 characters.");
        if (!email.includes("@") || !email.includes(".")) errors.push("Invalid email address.");
        if (password.length < 8) errors.push("Password must be at least 8 characters.");
        if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter.");
        if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number.");
        if (!/[!@#$%^&*]/.test(password)) errors.push("Password must contain a special character.");

        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, firstName, lastName, email, password })
            });

            if (response.ok) {
                alert("Registration successful! You can now log in.");
                window.location.href = "/login";
            } else {
                const message = await response.text();
                alert("Error: " + message);
            }
        } catch (err) {
            alert("Server connection failed.");
        }
    });
});
