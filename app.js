
const express = require('express');
const bodyParser = require('body-parser');
const ProductManager = require('./productManager');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const absoluteFilePath = path.join(currentDirectory, 'productos.json');
const productManagerInstance = new ProductManager(absoluteFilePath);

app.get('/products', (req, res) => {
  const { limit } = req.query;

  let productList = productManagerInstance.getProducts();

  if (limit) {
    const limitNumber = parseInt(limit, 10);
    if (!isNaN(limitNumber) && limitNumber > 0) {
      productList = productList.slice(0, limitNumber);
    } else {
      return res.status(400).json({ error: 'El parámetro limit debe ser un número positivo.' });
    }
  }

  res.json({ products: productList });
});

app.get('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid, 10);

  if (!isNaN(productId) && productId > 0) {
    const product = productManagerInstance.getProductById(productId);

    if (product) {
      res.json({ product });
    } else {
      res.status(404).json({ error: `Producto con ID ${productId} no encontrado.` });
    }
  } else {
    res.status(400).json({ error: 'El parámetro pid debe ser un número positivo.' });
  }
});

app.post('/products', (req, res) => {
  const { title, description, price, thumbnail, code, stock } = req.body;

  try {
    productManagerInstance.addProduct(title, description, price, thumbnail, code, stock);
    res.json({ message: 'Producto agregado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express iniciado en http://localhost:${port}`);
});
