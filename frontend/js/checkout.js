
document.addEventListener("DOMContentLoaded", () => {
    if (!requireLogin()) return;

    const form = document.getElementById("checkoutForm");
    const message = document.getElementById("checkoutMessage");
    const button = document.getElementById("placeOrderBtn");

    form.addEventListener("submit", async event => {
        event.preventDefault();

        message.textContent = "";
        button.disabled = true;

        try {
            const result = await apiRequest("/orders", {
                method: "POST",
                body: JSON.stringify({
                    deliveryAddress:
                        document.getElementById("address").value.trim()
                })
            });

            message.textContent =
                `Order placed successfully! Order ID: ${result.order._id}`;

            form.reset();

            setTimeout(() => {
                window.location.href = "orders.html";
            }, 1500);
        } catch (error) {
            message.textContent = error.message;
        } finally {
            button.disabled = false;
        }
    });
});
