
document.getElementById("registerForm").addEventListener(
    "submit",
    async event => {
        event.preventDefault();

        const message = document.getElementById("registerMessage");
        const button = document.getElementById("registerBtn");

        message.textContent = "";
        button.disabled = true;

        try {
            const result = await apiRequest("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    name: document.getElementById("name").value.trim(),
                    email: document.getElementById("email").value.trim(),
                    password: document.getElementById("password").value
                })
            });

            localStorage.setItem("foodiehub_token", result.token);

            message.textContent = "Account created successfully!";

            window.location.href = "menu.html";
        } catch (error) {
            message.textContent = error.message;
        } finally {
            button.disabled = false;
        }
    }
);
