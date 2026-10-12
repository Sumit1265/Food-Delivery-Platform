
document.getElementById("loginForm").addEventListener(
    "submit",
    async event => {
        event.preventDefault();

        const message = document.getElementById("loginMessage");
        const button = document.getElementById("loginBtn");

        message.textContent = "";
        button.disabled = true;

        try {
            const result = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email: document.getElementById("email").value.trim(),
                    password: document.getElementById("password").value
                })
            });

            localStorage.setItem("foodiehub_token", result.token);

            message.textContent = "Login successful!";

            window.location.href = "menu.html";
        } catch (error) {
            message.textContent = error.message;
        } finally {
            button.disabled = false;
        }
    }
);
