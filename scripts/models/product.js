// Product Model(Blue Print)
// Product JS Contain the Structure of a Pizza Object 
// Pizza Object - ID,Name,Desc,Price,Rating,Image
class Product {
  constructor(id, name, desc, price, url, vegetarian) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.url = url;
    this.vegetarian = vegetarian;
  }
}

export default Product;