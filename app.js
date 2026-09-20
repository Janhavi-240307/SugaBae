// ----------------------------Swiper(Slider) Setup----------------------------

var swiper = new Swiper(".mySwiper", {
    loop: true,
    navigation: {
        nextEl: "#next",
        prevEl: "#prev",
    },
});

// ----------------------------DOM Elements----------------------------

const cartIcon = document.querySelector(".cart-icon");
const cartTab = document.querySelector(".cart-tab");
const closebtn = document.querySelector(".close-btn");
const cardList = document.querySelector(".cardlist");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartVal = document.querySelector(".cart-value");
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const bars = document.querySelector(".fa-bars");

// ---------------------------- UI Interactions----------------------------

// Open cart sidebar
cartIcon.addEventListener("click", () => cartTab.classList.add("cart-tab-active"));

// Close cart sidebar
closebtn.addEventListener("click", () => cartTab.classList.remove("cart-tab-active"));

// Toggle mobile menu
hamburger.addEventListener("click", () => mobileMenu.classList.toggle("mobile-menu-active"));


// ---------------------------- State Arrays ----------------------------

let productList = [];
let cartProd = [];


// ----------------------------Update Cart Totals ----------------------------

const updateTotal = () => {
    let totalPrice = 0;
    let totalQtn = 0;

    // Loop through each item in cart to calculate totals
    document.querySelectorAll(".item").forEach(item => {
        const quantity = parseInt(item.querySelector(".quantity-value").textContent);
        const price = parseFloat(
            item.querySelector(".item-total").textContent.replace("$", "")
        );

        totalPrice += price;
        totalQtn += quantity;
    });

    // Update totals in UI
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    cartVal.textContent = totalQtn;
};


// ----------------------------Display Product Cards ----------------------------

const ShowCards = () => {

    productList.forEach(product => {

        // Create a product card
        const orderCard = document.createElement("div");

        orderCard.classList.add("ordercard");

        orderCard.innerHTML = `
        <div class="card-img">            
           <img src="${product.image}">               
        </div>
        <h4>${product.name}</h4>
        <h4 class="price">${product.price}</h4>
        <a href="#" class="btn card-btn">Add to cart</a>`;

        cardList.appendChild(orderCard);

        // Add "Add to Cart" functionality
        const cardBtn = orderCard.querySelector(".card-btn");

        cardBtn.addEventListener("click", (e) => {
            e.preventDefault();
            addToCart(product);
        });
    });
};


// ----------------------------Add Item to Cart----------------------------

const addToCart = (product) => {

    // Prevent duplicate entries in cart
    const existingProd = cartProd.find(item => item.id === product.id);

    if (existingProd) {
        alert("Item already in your cart!");
        return;
    }

    cartProd.push(product);

    let quantity = 1;
    let price = parseFloat(product.price.replace("$", ""));

    // Create cart item UI
    const cartItem = document.createElement("div");

    cartItem.classList.add("item");

    cartItem.innerHTML = `
    <div class="item-image">
        <img src="${product.image}">
    </div>

    <div class="detail">
        <h4>${product.name}</h4>
        <h4 class="item-total">${product.price}</h4>
    </div>

    <div class="flex">
        <a href="#" class="quantity-btn">
            <i class="fa-solid fa-minus minus"></i>
        </a>

        <h4 class="quantity-value">${quantity}</h4>

        <a href="#" class="quantity-btn">
            <i class="fa-solid fa-plus plus"></i>
        </a>
    </div>
    `;

    cartList.appendChild(cartItem);

    updateTotal();


    // ----------------------------Quantity Buttons----------------------------

    const plusBtn = cartItem.querySelector(".plus");
    const minusBtn = cartItem.querySelector(".minus");
    const qtnVal = cartItem.querySelector(".quantity-value");
    const itemTotal = cartItem.querySelector(".item-total");


    // Increase quantity
    plusBtn.addEventListener("click", (e) => {

        e.preventDefault();

        quantity++;

        qtnVal.textContent = quantity;
        itemTotal.textContent = `$${price * quantity}`;

        updateTotal();
    });


    // Decrease quantity or remove item if quantity = 0
    minusBtn.addEventListener("click", (e) => {

        e.preventDefault();

        if (quantity > 1) {

            quantity--;

            qtnVal.textContent = quantity;
            itemTotal.textContent = `$${price * quantity}`;

            updateTotal();

        } else {

            // Animation before removing
            cartItem.classList.add("slide-out");

            setTimeout(() => {

                cartItem.remove();

                cartProd = cartProd.filter(
                    item => item.id !== product.id
                );

                updateTotal();

            }, 300);
        }
    });
};


// ----------------------------Initialize App ----------------------------

const initApp = () => {

    // Fetch product data from JSON file
    fetch("products.json")
        .then(response => response.json())
        .then(data => {

            productList = data;

            ShowCards();
        })
        .catch(error => console.error("Error fetching JSON:", error));
};


// Run app
initApp();