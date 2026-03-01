const div = document.getElementById("data-container");
async function GetAllProducts() {
  const response = await fetch(
    "https://restaurant.stepprojects.ge/api/Products/GetAll",
  );
  const data = await response.json();
  renderProducts(data);
}

async function filtered(categoryId) {
    const response = await fetch(`https://restaurant.stepprojects.ge/api/Products/GetFiltered?categoryId=${categoryId}`);
    const data = await response.json();
    renderProducts(data);
    
}
async function NutsVeg(nuts, vegetarian) {
    const response = await fetch(`https://restaurant.stepprojects.ge/api/Products/GetFiltered?nuts=${nuts}&vegeterian=${vegetarian}`);
    const data = await response.json();
    renderProducts(data);
    
}
async function Spaciness(spaciness) {
    const response = await fetch(`https://restaurant.stepprojects.ge/api/Products/GetFiltered?spiciness=${spaciness}`);
    const data = await response.json();
    renderProducts(data);
    
}


function renderProducts(data) {
  div.innerHTML = "";
  data.forEach((element) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <img class="card-image" src="${element.image}" alt="${element.name}">
        <h2 >${element.name}</h2>
        <p class="spiciness">${element.spiciness}</p>
        <div class="nuts-vegeterian">
        <p>${element.nuts ? "🔴Nuts" : "⚪Nuts"}</p>
        <p>${element.vegeterian ? "🔴Vegeterian" : "⚪Vegeterian"}</p>
        </div>
        <div class="pricebtn">
         <p>$${element.price}</p>
         <button class="add-to-cart" data-product-id="${element.id}">Add to Cart</button>
        </div>
        `;

    div.appendChild(card);
    
  });
  addToCart();
}
// function addToCart() {
//     const allbtns = document.querySelectorAll(".add-to-cart");
//     allbtns.forEach(btn => {
//         btn.addEventListener("click", async () => {
//         const productId= btn.dataset.productId;
//         await fetch(`https://restaurant.stepprojects.ge/api/Baskets/AddToBasket/`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Content-Type":"application/json"
//                 },
//                 body:JSON.stringify({
//                     productId: Number(productId),
//                     quantity:1,
//                     price:0   
//                 })
//             });
//             alert("პროდუქტი დაემატა კალათაში");
            
//         });

//     });
    
// }
async function addToCart() {
    const allbtns = document.querySelectorAll(".add-to-cart");

    allbtns.forEach(btn => {
        btn.addEventListener("click", async () => {

            const productId = btn.dataset.productId;
            const response = await fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll");
            const basket = await response.json();

           
            const exists = basket.some(item => item.product.id === Number(productId));

            if (exists) {
                alert("ეს პროდუქტი უკვე დამატებულია კალათაში");
                return; 
            }

            
            await fetch(`https://restaurant.stepprojects.ge/api/Baskets/AddToBasket`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: Number(productId),
                    quantity: 1,
                    price: 0
                })
            });

            alert("პროდუქტი დაემატა კალათაში");

            // სურვილის შემთხვევაში ღილაკის გათიშვა
            btn.disabled = true;
            btn.textContent = "Added";
        });
    });
}
const vegetarianBtn = document.querySelector(".select-vegetarian");
const nutsBtn = document.querySelector(".select-nuts");

function veg() {
    const vegActive = vegetarianBtn.classList.contains("active");
    const nutsActive = nutsBtn.classList.contains("active");

 
}
vegetarianBtn.addEventListener("click", () => {
    vegetarianBtn.classList.toggle("active");
    veg();
});
nutsBtn.addEventListener("click", () => {
    nutsBtn.classList.toggle("active");
   veg();
});
const applyFilterBtn = document.querySelector(".apply-filter");
const resetFilterBtn = document.querySelector(".reset-filter");
applyFilterBtn.addEventListener("click", () => {
    const vegActive = vegetarianBtn.classList.contains("active");

    const nutsActive = nutsBtn.classList.contains("active");
    if(vegActive && nutsActive){
        NutsVeg(true, true);
    } else if(vegActive && !nutsActive){
        NutsVeg(false, true);
    } else if(!vegActive && nutsActive){
        NutsVeg(true, false);
    }

   Spaciness(value.textContent);
  });
resetFilterBtn.addEventListener("click", () => {
    vegetarianBtn.classList.remove("active");
    nutsBtn.classList.remove("active");
    value.textContent = 0;
    GetAllProducts();
});
const allBtn = document.querySelectorAll(".allbtn");
allBtn.forEach(button => {
    button.addEventListener("click", () => {
        allBtn.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
    });
});
const range = document.getElementById("spiceRange");
const value = document.getElementById("spiceValue");
const spice = range.addEventListener("input", function() {
  value.textContent = this.value;
  
});
GetAllProducts();



