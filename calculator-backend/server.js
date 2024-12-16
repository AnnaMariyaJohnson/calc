const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001; // Backend port updated

// CORS configuration
const corsOptions = {
  origin: 'http://192.168.137.121:3000', // Frontend URL or your local IP address
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_calculator',
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// API to perform calculation and store the result
app.post('/calculate', (req, res) => {
  const { operation, first_number, second_number } = req.body;

  const num1 = parseFloat(first_number);
  const num2 = parseFloat(second_number);

  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: 'Invalid numbers provided' });
  }

  let result;
  switch (operation) {
    case 'add':
      result = num1 + num2;
      break;
    case 'subtract':
      result = num1 - num2;
      break;
    case 'multiply':
      result = num1 * num2;
      break;
    case 'divide':
      if (num2 === 0) {
        return res.status(400).json({ error: 'Division by zero is not allowed' });
      }
      result = num1 / num2;
      break;
    default:
      return res.status(400).json({ error: 'Invalid operation' });
  }

  // Insert the result into the history table
  const query = `INSERT INTO history (first_number, second_number, operation, result) VALUES (?, ?, ?, ?)`;
  db.query(query, [num1, num2, operation, result], (err) => {
    if (err) {
      console.error('Error inserting calculation:', err);
      return res.status(500).json({ error: 'Failed to save calculation' });
    }
    res.json({ result });
  });
});

// API to fetch calculation history
app.get('/history', (req, res) => {
  const query = `SELECT * FROM history ORDER BY created_at DESC`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching history:', err);
      return res.status(500).json({ error: 'Failed to fetch history' });
    }
    res.json(results);
  });
});

// API to clear calculation history
app.delete('/history', (req, res) => {
  const query = `DELETE FROM history`;
  db.query(query, (err) => {
    if (err) {
      console.error('Error clearing history:', err);
      return res.status(500).json({ error: 'Failed to clear history' });
    }
    res.json({ message: 'Calculation history cleared' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://192.168.137.121:${PORT}`);
});
