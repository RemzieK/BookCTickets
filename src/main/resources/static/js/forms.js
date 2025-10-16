document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault(); // prevent default form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Example: simple validation
    if(username === "" || password === "") {
        alert("Please fill all fields.");
        return;
    }

    // Here you can add AJAX/fetch to send data to backend
    console.log("Username:", username, "Password:", password);
    alert("Login form submitted!");
});
