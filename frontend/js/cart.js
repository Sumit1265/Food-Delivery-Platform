document.addEventListener("DOMContentLoaded", () => {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const cartItems = document.getElementById("cartItems");
    const emptyCart = document.getElementById("emptyCart");

    const subtotalElement = document.getElementById("subtotal");
    const deliveryElement = document.getElementById("deliveryFee");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");

    const checkoutBtn = document.getElementById("checkoutBtn");


    // Display Cart
    function displayCart() {

        cartItems.innerHTML = "";

        if (cart.length === 0) {

            emptyCart.style.display = "block";

            subtotalElement.textContent = "₹0";
            taxElement.textContent = "₹0";
            totalElement.textContent = "₹0";

            return;
        }

        emptyCart.style.display = "none";


        cart.forEach((item, index) => {

            const cartItem = document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `

                <img 
                    src="${item.image}" 
                    alt="${item.name}"
                >

                <div class="item-details">

                    <h3>${item.name}</h3>

                    <p>₹${item.price} per item</p>

                </div>


                <div class="quantity-control">

                    <button 
                        onclick="decreaseQuantity(${index})">
                        -
                    </button>

                    <span class="quantity">
                        ${item.quantity}
                    </span>

                    <button 
                        onclick="increaseQuantity(${index})">
                        +
                    </button>

                </div>


                <div class="item-price">

                    ₹${item.price * item.quantity}

                </div>


                <button 
                    class="remove-btn"
                    onclick="removeItem(${index})">

                    Remove

                </button>

            `;

            cartItems.appendChild(cartItem);

        });


        updateSummary();
    }


    // Increase Quantity
    window.increaseQuantity = function(index) {

        cart[index].quantity++;

        saveCart();

    };


    // Decrease Quantity
    window.decreaseQuantity = function(index) {

        if (cart[index].quantity > 1) {

            cart[index].quantity--;

        } else {

            cart.splice(index, 1);

        }

        saveCart();

    };


    // Remove Item
    window.removeItem = function(index) {

        cart.splice(index, 1);

        saveCart();

    };


    // Save Cart
    function saveCart() {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        displayCart();

    }


    // Update Summary
    function updateSummary() {

        let subtotal = 0;

        cart.forEach(item => {

            subtotal += item.price * item.quantity;

        });


        const deliveryFee = subtotal > 0 ? 40 : 0;

        const tax = subtotal * 0.05;

        const total = subtotal + deliveryFee + tax;


        subtotalElement.textContent =
            `₹${subtotal.toFixed(2)}`;

        deliveryElement.textContent =
            `₹${deliveryFee.toFixed(2)}`;

        taxElement.textContent =
            `₹${tax.toFixed(2)}`;

        totalElement.textContent =
            `₹${total.toFixed(2)}`;

    }


    // Checkout
    checkoutBtn.addEventListener("click", () => {

        if (cart.length === 0) {

            alert("Your cart is empty!");

            return;
        }


        const token = localStorage.getItem("token");


        if (!token) {

            alert("Please login before checkout.");

            window.location.href = "login.html";

            return;
        }


        window.location.href = "checkout.html";

    });


    // Initial Display
    displayCart();

});