const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@harsini2415',
    database: 'employee_management'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// POST route to add an employee
app.post('/api/employees', (req, res) => {
    console.log(req.body);
    const { name, employee_id, email, phone, department, date_of_joining, role } = req.body;

    // Validate phone number
    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: 'Invalid phone number format. Please enter a 10-digit phone number.' });
    }

    // Query to insert the new employee into the database
    const query = 'INSERT INTO employees (name, employee_id, email, phone, department, date_of_joining, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, employee_id, email, phone, department, date_of_joining, role], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error: Unable to add employee.' });
        }
        return res.status(200).json({ message: 'Employee added successfully!' });
    });
});

// GET route to fetch all employees from the database
app.get('/api/employees', (req, res) => {
    const query = 'SELECT * FROM employees';
    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error fetching employees data.' });
        }
        return res.status(200).json(results);
    });
});

// PUT route to update employee details by ID
// PUT route to update an employee by ID
app.put('/api/employees/:id', (req, res) => {
    const employeeId = req.params.id;
    const { name, employee_id, email, phone, department, date_of_joining, role } = req.body;

    // Validate phone number
    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: 'Invalid phone number format. Please enter a 10-digit phone number.' });
    }

    // Query to update the employee in the database
    const query = `
        UPDATE employees 
        SET name = ?, employee_id = ?, email = ?, phone = ?, department = ?, date_of_joining = ?, role = ? 
        WHERE id = ?
    `;
    db.query(query, [name, employee_id, email, phone, department, date_of_joining, role, employeeId], (err, result) => {
        if (err) {
            console.log('Error updating employee:', err);
            return res.status(500).json({ message: 'Error updating employee.' });
        }
        if (result.affectedRows === 0) {
            console.log('Employee not found with ID:', employeeId);
            return res.status(404).json({ message: 'Employee not found.' });
        }
        console.log('Employee updated successfully.');
        return res.status(200).json({ message: 'Employee updated successfully!' });
    });
});


// DELETE route to remove an employee by ID
app.delete('/api/employees/:id', (req, res) => {
    const employeeId = req.params.id;
    console.log('Received ID for deletion:', employeeId);

    const query = 'DELETE FROM employees WHERE id = ?';
    db.query(query, [employeeId], (err, result) => {
        if (err) {
            console.error('Error deleting employee:', err);
            return res.status(500).json({ message: 'Error deleting employee.' });
        }
        if (result.affectedRows === 0) {
            console.log('Employee not found with ID:', employeeId);
            return res.status(404).json({ message: 'Employee not found.' });
        }
        console.log('Employee deleted successfully.');
        return res.status(200).json({ message: 'Employee deleted successfully!' });
    });
});

// Welcome route (optional)
app.get('/', (req, res) => {
    res.send('Welcome to the Employee Management System');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
