const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

let products = [];

// Get all products
router.get('/', (req, res) => {
  res.json(products);
});

// Get a single product by ID
router.get('/:id', [
  param('id').isInt().withMessage('ID must be an integer')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Create a new product
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0')
], (req, res) => {
    //console.log(req.body)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update a product by ID
router.put('/:id', [
  param('id').isInt().withMessage('ID must be an integer'),
  body('name').optional().notEmpty().withMessage('Name must not be empty'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (req.body.name) product.name = req.body.name;
  if (req.body.price) product.price = req.body.price;

  res.json(product);
});

// Delete a product by ID
router.delete('/:id', [
  param('id').isInt().withMessage('ID must be an integer')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.status(204).send({msg: "product deleted"});
});

module.exports = router;
