const API_URL= "https://restaurant.stepprojects.ge/api/Products/GetAll";
const div = document.getElementById("data-container");
async function Products(){
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log(data);
    data.forEach(element => {
        const card = document.createElement("div");
        card.id = "card";
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
         <button id="add-to-cart">Add to Cart</button>
        </div>
        `;

        document.getElementById("data-container").appendChild(card);
    });
}
Products();



