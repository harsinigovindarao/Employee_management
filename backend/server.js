const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');

const app = express();
const port = 5000;

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
});

// Middleware
app.use(helmet()); // Helps secure your app by setting various HTTP headers

// CORS Middleware
app.use(cors({
    origin: '*', // Allow all origins for testing
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));

// JSON Parsing Middleware
app.use(express.json()); // Parses incoming requests with JSON payloads

// URL-Encoded Parsing Middleware
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded payloads

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1);
    }
    console.log('Connected to MySQL');
});

// POST route to add an employee
app.post('/api/employees', (req, res) => {
    const { name, employee_id, email, phone, department, date_of_joining, role } = req.body;

    // Validate incoming data
    if (!name || !employee_id || !email || !phone || !department || !date_of_joining || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: 'Invalid phone number format. Please enter a 10-digit phone number.' });
    }

    const query = 'INSERT INTO employees (name, employee_id, email, phone, department, date_of_joining, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, employee_id, email, phone, department, date_of_joining, role], (err) => {
        if (err) {
            console.error('Error adding employee:', err);
            return res.status(500).json({ message: 'Error: Unable to add employee.' });
        }
        res.status(200).json({ message: 'Employee added successfully!' });
    });
});

// GET route to fetch all employees
app.get('/api/employees', (req, res) => {
    const query = 'SELECT * FROM employees';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching employees:', err);
            return res.status(500).json({ message: 'Error fetching employees data.' });
        }
        res.status(200).json(results);
    });
});

// PUT route to update employee by ID
app.put('/api/employees/:id', (req, res) => {
    const employeeId = parseInt(req.params.id, 10);
    if (isNaN(employeeId)) {
        return res.status(400).json({ message: 'Invalid employee ID' });
    }

    const { name, employee_id, email, phone, department, date_of_joining, role } = req.body;

    // Validate incoming data
    if (!name || !employee_id || !email || !phone || !department || !date_of_joining || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: 'Invalid phone number format.' });
    }

    const query = `
        UPDATE employees 
        SET name = ?, employee_id = ?, email = ?, phone = ?, department = ?, date_of_joining = ?, role = ? 
        WHERE id = ?
    `;
    db.query(query, [name, employee_id, email, phone, department, date_of_joining, role, employeeId], (err, result) => {
        if (err) {
            console.error('Error updating employee:', err);
            return res.status(500).json({ message: 'Error updating employee.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        res.status(200).json({ message: 'Employee updated successfully!' });
    });
});

// DELETE route to remove employee by ID
app.delete('/api/employees/:id', (req, res) => {
    const employeeId = parseInt(req.params.id, 10);
    if (isNaN(employeeId)) {
        return res.status(400).json({ message: 'Invalid employee ID' });
    }

    const query = 'DELETE FROM employees WHERE id = ?';
    db.query(query, [employeeId], (err, result) => {
        if (err) {
            console.error('Error deleting employee:', err);
            return res.status(500).json({ message: 'Error deleting employee.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        res.status(200).json({ message: 'Employee deleted successfully!' });
    });
});

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the Employee Management System');
});

// Catch-all error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
