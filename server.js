const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// MySQL connection setup
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});


// 1. Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving patients:', err);
      res.status(500).send('Error retrieving patients');
      return;
    }
    res.json(results);
  });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving providers:', err);
      res.status(500).send('Error retrieving providers');
      return;
    }
    res.json(results);
  });
});

// 3. Filter patients by first name
app.get('/patients/:first_name', (req, res) => {
  const { first_name } = req.params;
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  connection.query(query, [first_name], (err, results) => {
    if (err) {
      console.error('Error retrieving patients by first name:', err);
      res.status(500).send('Error retrieving patients by first name');
      return;
    }
    res.json(results);
  });
});

// 4. Retrieve all providers by specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  const { specialty } = req.params;
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  connection.query(query, [specialty], (err, results) => {
    if (err) {
      console.error('Error retrieving providers by specialty:', err);
      res.status(500).send('Error retrieving providers by specialty');
      return;
    }
    res.json(results);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
