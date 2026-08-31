document.getElementById("loginForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let message = document.getElementById("message");

    // Demo login credentials
    if (email === "admin@gmail.com" && password === "12345") {
        message.style.color = "green";
        message.textContent = "Login successful!";

        // Redirect to dashboard
        // window.location.href = "dashboard.html";
    } 
    else {
        message.style.color = "red";
        message.textContent = "Invalid email or password!";
    }
});