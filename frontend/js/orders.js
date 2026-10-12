
document.addEventListener("DOMContentLoaded", async () => {
    if (!requireLogin()) return;

    const container = document.getElementById("ordersList");
    const message = document.getElementById("ordersMessage");

    try {
        const result = await apiRequest("/orders");
        const orders = result.orders || [];

        if (!orders.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <h2>No orders yet</h2>
                    <p class="muted">Your orders will appear here.</p>
                    <a class="btn" href="menu.html">Explore Menu</a>
                </div>`;
            return;
        }

        container.innerHTML = orders.map(order => {
            const items = (order.items || []).map(item => `
                <li>
                    ${escapeHTML(item.name)} × ${item.quantity}
                    — ₹${Number(item.unitPrice * item.quantity).toFixed(2)}
                </li>
            `).join("");

            return `
                <article class="order-card">
                    <div class="food-bottom">
                        <h2>Order #${escapeHTML(order._id)}</h2>
                        <span class="badge">${escapeHTML(order.status)}</span>
                    </div>

                    <p class="muted">
                        ${new Date(order.createdAt).toLocaleString()}
                    </p>

                    <ul style="margin:14px 0 14px 20px">
                        ${items}
                    </ul>

                    <p><strong>Total:</strong>
                        ₹${Number(order.total).toFixed(2)}
                    </p>

                    <p><strong>Delivery address:</strong>
                        ${escapeHTML(order.deliveryAddress)}
                    </p>
                </article>
            `;
        }).join("");
    } catch (error) {
        message.textContent = error.message;
        container.textContent = "";
    }
});
