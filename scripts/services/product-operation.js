// Products CRUD Operation
// C-Create R-Read U-Update D-Delete
import Product from "../models/product.js";
import donetworkcall from "./api-client.js";

const productOperation = {
  products: [],

  async loadproduct() {
    const pizzas = await donetworkcall();

    const vegPizzas =
      pizzas["Vegetarian"] || pizzas["vegetarian"] || [];

    const nonVegPizzas =
      pizzas["Non-Vegetarian"] || pizzas["nonvegetarian"] || [];

    const pizzaarray = [...vegPizzas, ...nonVegPizzas];

    const productarray = pizzaarray.map((pizza) => {
      let imageUrl =
        pizza.assets?.product_details_page?.[0]?.url ||
        "https://via.placeholder.com/150?text=Pizza";

      return new Product(
        pizza.id,
        pizza.name,
        pizza.menu_description,
        Number(pizza.price),
        imageUrl,
        pizza.classifications?.vegetarian
      );
    });

    this.products = productarray;
    return productarray;
  },

  search(pizzaid) {
    return this.products.find((p) => p.id == pizzaid);
  },
};

export default productOperation;  