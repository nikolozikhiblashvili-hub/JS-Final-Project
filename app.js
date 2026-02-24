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
         <button id="add-to-cart" onclick="addToBasket(${element.id})">Add to Cart</button>
        </div>
        `;

    div.appendChild(card);
  });
}
const vegetarianBtn = document.querySelector(".select-vegetarian");
const nutsBtn = document.querySelector(".select-nuts");

function veg() {
    const vegActive = vegetarianBtn.classList.contains("active");
    const nutsActive = nutsBtn.classList.contains("active");
// NutsVeg(nutsActive, vegActive);
 
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
  });
resetFilterBtn.addEventListener("click", () => {
    vegetarianBtn.classList.remove("active");
    nutsBtn.classList.remove("active");
    GetAllProducts();
});
GetAllProducts();



