const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Harshit1109@',
    port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Routes for products
app.get('/products', async (req, res) => {
    try {
        const products = await pool.query('SELECT * FROM products');
        res.json(products.rows);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/products', async (req, res) => {
    try {
        const { name, description, price, quantity } = req.body;

        // Check for required fields
        if (!name || !description || price === undefined || quantity === undefined) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const newProduct = await pool.query(
            'INSERT INTO products (name, description, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, price, quantity]
        );
        res.status(201).json(newProduct.rows[0]);
    } catch (err) {
        console.error('Error adding product:', err.message);
        res.status(500).send('Server Error');
    }
});

app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, quantity } = req.body;

        // Check for required fields
        if (!name || !description || price === undefined || quantity === undefined) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const updatedProduct = await pool.query(
            'UPDATE products SET name = $1, description = $2, price = $3, quantity = $4 WHERE id = $5 RETURNING *',
            [name, description, price, quantity, id]
        );

        if (updatedProduct.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(updatedProduct.rows[0]);
    } catch (err) {
        console.error('Error updating product:', err.message);
        res.status(500).send('Server Error');
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.sendStatus(204);
    } catch (err) {
        console.error('Error deleting product:', err.message);
        res.status(500).send('Server Error');
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
