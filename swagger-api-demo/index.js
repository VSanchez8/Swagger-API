// index.js
const express = require('express');
const setupSwagger = require('./swagger');

const app = express();
app.use(express.json());

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Retrieve a list of items
 *     responses:
 *       200:
 *         description: A list of items
 */
app.get('/items', (req, res) => {
  res.status(200).json({ message: 'GET request - Retrieve items' });
});

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     responses:
 *       201:
 *         description: Item created successfully
 */
app.post('/items', (req, res) => {
  res.status(201).json({ message: 'POST request - Create item' });
});

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Retrieve a single item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single item
 */
app.get('/items/:id', (req, res) => {
  res.status(200).json({ message: `GET request - Retrieve item with ID ${req.params.id}` });
});

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update an item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item updated successfully
 */
app.put('/items/:id', (req, res) => {
  res.status(200).json({ message: `PUT request - Update item with ID ${req.params.id}` });
});

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 */
app.delete('/items/:id', (req, res) => {
  res.status(200).json({ message: `DELETE request - Delete item with ID ${req.params.id}` });
});

// Setup Swagger
setupSwagger(app);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
