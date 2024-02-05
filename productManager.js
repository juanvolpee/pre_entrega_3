const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = this.loadProducts();
  }

   validate(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error("Todos los campos son obligatorios.");
    }

    if (this.productos.some(product => product.code === code)) {
        throw new Error("El código del producto ya está en uso.");
    }
    }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // Si hay un error al leer el archivo devuelve un array vacío.
      return [];
    }
  }

  saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data, 'utf8');
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    this.validate(title, description, price, thumbnail, code, stock);

    const newProduct = {
        id: ++this.lastProductId,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    };
    this.products.push(newProduct);
    this.saveProducts();
  }

  getProducts() {
    return this.products;
  }

  getProductById(productId) {
    return this.products.find(product => product.id === productId);
  }

  updateProduct(productId, fieldToUpdate, newValue) {
    const productToUpdate = this.getProductById(productId);

    if (productToUpdate) {
      productToUpdate[fieldToUpdate] = newValue;
      this.saveProducts();
    } else {
      console.log(`Producto con ID ${productId} no encontrado.`);
    }
  }

  deleteProduct(productId) {
    const productIndex = this.products.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
      // Elimina el producto
      this.products.splice(productIndex, 1);
      this.saveProducts();
      console.log(`Producto con ID ${productId} eliminado.`);
    } else {
      console.log(`Producto con ID ${productId} no encontrado.`);
    }
  }

  generateProductId() {
    return Math.floor(Math.random() * 1000);
  }


}

module.exports = ProductManager;



//prueba
const filePath = 'productos.json';

// Crea una instancia de ProductManager con la ruta del archivo
const productManager = new ProductManager(filePath);


productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);

const allProducts = productManager.getProducts();
console.log(allProducts);

const productIdToSearch = 1;
const productById = productManager.getProductById(productIdToSearch);
console.log(productById);

