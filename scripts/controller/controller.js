// Glue b/w view and model
import productOperation from "../services/product-operation.js";

let allPizzas = [];
let currentFilter = "all";

async function loadpizza() {
  allPizzas = await productOperation.loadproduct();
  renderPizzaCards(allPizzas);
}

function renderPizzaCards(pizzas) {
  const outdiv = document.querySelector("#output");
  outdiv.innerHTML = "";
  for (let pizza of pizzas) {
    preparePizzaCard(pizza);
  }
}

function addToCart() {
  const pizzaid = this.getAttribute("product-id");
  const product = productOperation.search(pizzaid);

  if (product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find((item) => item.id == product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Open basket drawer
    const cartDrawer = document.querySelector("#cartDrawer");
    const drawer = bootstrap.Offcanvas.getOrCreateInstance(cartDrawer);
    drawer.show();

    // Show updated basket
    showCartItems();
  }
}
function showCartItems() {
  const cartItemsDiv = document.querySelector("#cartItems");
  const cartTotal = document.querySelector("#cartTotal");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    cartItemsDiv.innerHTML =
      '<p class="text-secondary">Your basket is empty.</p>';
    cartTotal.innerText = "₹0";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const itemDiv = document.createElement("div");
    itemDiv.className = "mb-3 p-3 rounded-3";
    itemDiv.style.background = "#1f1f22";

    itemDiv.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h6 class="text-white mb-1">${item.name}</h6>
          <div class="d-flex align-items-center gap-2 mt-2">
  <button
    class="btn btn-sm btn-outline-light"
    onclick="updateQuantity('${item.id}', -1)"
  >
    −
  </button>

  <span class="text-white fw-bold">
    ${item.quantity}
  </span>

  <button
    class="btn btn-sm btn-outline-light"
    onclick="updateQuantity('${item.id}', 1)"
  >
    +
  </button>
</div>
        </div>

        <strong class="text-warning">
          ₹${itemTotal}
        </strong>
      </div>
    `;

    cartItemsDiv.appendChild(itemDiv);
  });

  cartTotal.innerText = `₹${total}`;
}
function updateQuantity(productId, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const item = cart.find((pizza) => pizza.id == productId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter((pizza) => pizza.id != productId);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  showCartItems();
}
window.updateQuantity = updateQuantity;


function preparePizzaCard(pizza) {
  const outdiv = document.querySelector("#output");

  const coldiv = document.createElement("div");
  coldiv.className = "col-md-4 mb-4";

  const carddiv = document.createElement("div");
  carddiv.className = "card h-100 shadow-sm";

  const img = document.createElement("img");
  img.src = pizza.url;
  img.className = "card-img-top";
  img.alt = pizza.name;
  carddiv.appendChild(img);

  const cardbody = document.createElement("div");
  cardbody.className = "card-body d-flex flex-column justify-content-between";

  const contentDiv = document.createElement("div");

  const h5 = document.createElement("h5");
  h5.className = "card-title mb-2";
  h5.innerText = pizza.name;

  const priceTag = document.createElement("h6");
  priceTag.className = "text-warning fw-bold mb-3";
  priceTag.innerText = `₹${pizza.price}`;

  const pTag = document.createElement("p");
  pTag.className = "card-text mb-4";
  pTag.innerText = pizza.desc;

  contentDiv.appendChild(h5);
  contentDiv.appendChild(priceTag);
  contentDiv.appendChild(pTag);

  const button = document.createElement("button");
  button.setAttribute("product-id", pizza.id);
  button.className = "btn btn-primary w-100 mt-2";
  button.innerText = "Add To Cart";
  button.addEventListener("click", addToCart);

  cardbody.appendChild(contentDiv);
  cardbody.appendChild(button);

  carddiv.appendChild(cardbody);
  coldiv.appendChild(carddiv);
  outdiv.appendChild(coldiv);
}

function applyFilters() {
  const keyword = document
    .querySelector("#searchBox")
    .value
    .trim()
    .toLowerCase();

  let filtered = allPizzas;

  if (currentFilter === "veg") {
    filtered = filtered.filter(
      (pizza) => pizza.vegetarian === true
    );
  }

  if (currentFilter === "nonveg") {
    filtered = filtered.filter(
      (pizza) => pizza.vegetarian === false
    );
  }

  if (keyword !== "") {
    filtered = filtered.filter(
      (pizza) =>
        pizza.name.toLowerCase().includes(keyword) ||
        pizza.desc.toLowerCase().includes(keyword)
    );
  }

  renderPizzaCards(filtered);
}

document.querySelector("#allBtn")?.addEventListener("click", function () {
  currentFilter = "all";
  applyFilters();
});

document.querySelector("#vegBtn")?.addEventListener("click", function () {
  currentFilter = "veg";
  applyFilters();
});

document
  .querySelector("#nonVegBtn")
  ?.addEventListener("click", function () {
    currentFilter = "nonveg";
    applyFilters();
  });

document.querySelector("#searchBox")?.addEventListener("input", applyFilters);

loadpizza();