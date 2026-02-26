
const basketContainer = document.getElementById("basket-container");
async function GetBasket() {
    const response = await fetch(`https://restaurant.stepprojects.ge/api/Baskets/GetAll`);
    const data = await response.json();
    console.log(data);
    renderBasket(data);
}
GetBasket();

function renderBasket(data){
    basketContainer.innerHTML="";
    data.forEach((element) => {
        const basket=document.createElement("div");
        basket.classList.add("basket-card");
        basket.innerHTML=`
        <div class="product-info">
        <button class="remove-from-cart" data-product-id="${element.product.id}">Remove</button>
        <img class="card-image" src="${element.product.image}" alt="${element.product.name}">
        <h2>${element.product.name}</h2>
        </div>

        <div class="total-price">
        <div class="quantity-info">
        <button class=" decrease" data-product-id="${element.product.id}">-</button>
        <p class="quantity-display">${element.quantity}</p>
        <button class=" increase" data-product-id="${element.product.id}">+</button>
        </div>
        <p>Price: $${element.price}</p>
        <p>Total: $${element.price * element.quantity}</p>
        </div>
        `;
        basketContainer.appendChild(basket);
        
    });
removeFromCart();
}





async function Remove(productId) {
    const response = await fetch(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${productId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (response.ok) {
        GetBasket(); // Refresh the basket after removal
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

