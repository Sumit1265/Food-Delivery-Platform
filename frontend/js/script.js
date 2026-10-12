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




function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function foodCard(food) {
    const id = escapeHTML(food._id);
    const name = escapeHTML(food.name);
    const description = escapeHTML(food.description || "Freshly prepared");
    const price = Number(food.price);

    const image = food.imageUrl &&
        /^https?:\/\//i.test(food.imageUrl)
        ? food.imageUrl
        : "";

    return `
        <article class="food-card">
            ${image
                ? `<img class="food-image"
                       src="${escapeHTML(image)}"
                       alt="${name}"
                       loading="lazy">`
                : `<div class="food-image"
                       role="img"
                       aria-label="${name} image unavailable"
                       style="display:grid;place-items:center;font-size:48px">
                       🍽️
                   </div>`
            }

            <div class="food-info">
                <h3>${name}</h3>
                <p>${description}</p>

                <div class="food-bottom">
                    <span class="price">₹${price.toFixed(2)}</span>
                    <button class="btn add-food"
                            data-food-id="${id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        </article>
    `;
}

async function addFood(foodId, button) {
    try {
        if (!localStorage.getItem("foodiehub_token")) {
            window.location.href = "login.html";
            return;
        }

        button.disabled = true;

        await apiRequest("/cart/items", {
            method: "POST",
            body: JSON.stringify({
                foodId,
                quantity: 1
            })
        });

        button.textContent = "Added ✓";
    } catch (error) {
        alert(error.message);
    } finally {
        button.disabled = false;
    }
}

function attachAddButtons(container) {
    container.querySelectorAll(".add-food").forEach(button => {
        button.addEventListener("click", () => {
            addFood(button.dataset.foodId, button);
        });
    });
}

async function loadMenu() {
    const container = document.getElementById("foodList");
    if (!container) return;

    const message = document.getElementById("menuMessage");
    const search = document.getElementById("foodSearch").value.trim();
    const category = document.getElementById("foodCategory").value;

    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (category) params.set("category", category);

    container.innerHTML = "<p>Loading menu...</p>";
    message.textContent = "";

    try {
        const result = await apiRequest(`/foods?${params.toString()}`);
        const foods = result.foods || [];

        container.innerHTML = foods.length
            ? foods.map(foodCard).join("")
            : "<p>No food items found. Try another search.</p>";

        attachAddButtons(container);
    } catch (error) {
        container.innerHTML = "";
        message.textContent = error.message;
    }
}

async function loadFeaturedFoods() {
    const container = document.getElementById("featuredFoods");
    if (!container) return;

    const message = document.getElementById("homeMessage");

    try {
        const result = await apiRequest("/foods");
        const foods = (result.foods || []).slice(0, 3);

        container.innerHTML = foods.length
            ? foods.map(foodCard).join("")
            : "<p>Our menu is being prepared. Please check again soon.</p>";

        attachAddButtons(container);
    } catch (error) {
        container.innerHTML = "";
        message.textContent = error.message;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) searchBtn.addEventListener("click", loadMenu);

    const searchInput = document.getElementById("foodSearch");

    if (searchInput) {
        searchInput.addEventListener("keydown", event => {
            if (event.key === "Enter") loadMenu();
        });
    }

    if (document.getElementById("foodList")) loadMenu();
    if (document.getElementById("featuredFoods")) loadFeaturedFoods();

    const logoutBtn = document.getElementById("logoutBtn");
    const authLink = document.getElementById("authLink");

    if (logoutBtn && authLink) {
        const loggedIn = Boolean(
            localStorage.getItem("foodiehub_token")
        );

        logoutBtn.hidden = !loggedIn;
        authLink.hidden = loggedIn;

        logoutBtn.addEventListener("click", logout);
    }
});
