
const basketContainer = document.getElementById("basket-container");

if (basketContainer) {
    GetBasket();
}
async function GetBasket() {
    const response = await fetch(`https://restaurant.stepprojects.ge/api/Baskets/GetAll`);
    const data = await response.json();
    console.log(data);
    renderBasket(data);
}


function renderBasket(data){
    basketContainer.innerHTML="";
    data.forEach((element) => {
        const basket=document.createElement("div");
        basket.classList.add("basket-card");
        basket.innerHTML=`
        <div class="product-info">
        <button class="remove-from-cart" data-product-id="${element.product.id}">❌</button>
        <img class="card-image" src="${element.product.image}" alt="${element.product.name}">
        <h2>${element.product.name}</h2>
        </div>

        <div class="total-price">
        <div class="quantity-info">
        <button class=" decrease" data-product-id="${element.product.id}">-</button>
        <p class="quantity-display">${element.quantity}</p>
        <button class=" increase" data-product-id="${element.product.id}">+</button>
        </div>
        <p>Price: $${element.product.price }</p>
        <p>Total: $${element.product.price * element.quantity}</p>
        
        </div>
        `;
        basketContainer.appendChild(basket);
        
    });
removeFromCart();
calculateTotalPrice(data);
}



async function UpdateQuantity(productId, newQuantity) {
    const response = await fetch(`https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            productId: productId,
            quantity: newQuantity
        })
    });
    if (response.ok) {
        GetBasket(); // Refresh the basket after updating quantity
    } else {
        console.error("Failed to update quantity");
    }
}
// basketContainer.addEventListener("click", (event) => {
//     if (event.target.classList.contains("increase")) {
//         const productId = event.target.dataset.productId;
//         const quantityDisplay = event.target.parentElement.querySelector(".quantity-display");
//         const currentQuantity = parseInt(quantityDisplay.textContent);
//         UpdateQuantity(productId, currentQuantity + 1);
//     } else if (event.target.classList.contains("decrease")) {
//         const productId = event.target.dataset.productId;
//         const quantityDisplay = event.target.parentElement.querySelector(".quantity-display");
//         const currentQuantity = parseInt(quantityDisplay.textContent);
//         if (currentQuantity > 1) {
//             UpdateQuantity(productId, currentQuantity - 1);
//         } else {
//             Remove(productId); 
//         }
//     }
// });
basketContainer.addEventListener("click", (event) => {

    if (event.target.classList.contains("increase")) {
        const productId = event.target.dataset.productId;
        const quantityDisplay = event.target.parentElement.querySelector(".quantity-display");
        const currentQuantity = parseInt(quantityDisplay.textContent);
        UpdateQuantity(productId, currentQuantity + 1);
    }

    else if (event.target.classList.contains("decrease")) {
        const productId = event.target.dataset.productId;
        const quantityDisplay = event.target.parentElement.querySelector(".quantity-display");
        const currentQuantity = parseInt(quantityDisplay.textContent);

        if (currentQuantity > 1) {
            UpdateQuantity(productId, currentQuantity - 1);
        } else {
            Remove(productId);
        }
    }

    else if (event.target.classList.contains("remove-from-cart")) {
        const productId = event.target.dataset.productId;
        Remove(productId);
    }

});

async function Remove(productId) {
    const response = await fetch(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${productId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (response.ok) {
        GetBasket(); 
    } else {
        console.error("Failed to remove item from basket");
    }
}
function removeFromCart() {
const removeButtons = document.querySelectorAll(".remove-from-cart");
removeButtons.forEach(button => {
    button.addEventListener("click", () => {
        const productId = button.dataset.productId;
        Remove(productId);
    });
});
}
const totalPriceElement = document.getElementById("total-price");
function calculateTotalPrice(data) {
    const totalPrice = data.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);
    totalPriceElement.textContent = `Total Price: $${totalPrice}`;
}

window.addEventListener("scroll", () => {
    const header = document.querySelector(".header-content");

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});
const burger = document.getElementById("burger");
const menu = document.querySelector(".home-cart");
burger.addEventListener("click", () => {
  menu.classList.toggle("active");
  burger.classList.toggle("active");
});
