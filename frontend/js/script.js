document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;
            const message = document.getElementById("loginMessage");

            if (email === "admin@gmail.com" && password === "12345") {
                message.style.color = "green";
                message.textContent = "Login successful!";
            } else {
                message.style.color = "red";
                message.textContent = "Invalid email or password!";
            }
        });
    }
});