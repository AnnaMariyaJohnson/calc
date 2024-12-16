const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001; // Backend port updated

// CORS configuration
const corsOptions = {
  origin: 'http://192.168.137.2:8083', // Frontend URL or your local IP address
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
  const { expression } = req.body;

  try {
    // Use eval to evaluate the expression safely
    const result = eval(expression);

    // Insert the expression and result into the history table
    const query = `INSERT INTO history (expression, result) VALUES (?, ?)`;
    db.query(query, [expression, result], (err) => {
      if (err) {
        console.error('Error inserting calculation:', err);
        return res.status(500).json({ error: 'Failed to save calculation' });
      }
      res.json({ result });
    });
  } catch (err) {
    console.error('Error calculating expression:', err);
    return res.status(400).json({ error: 'Invalid Expression' });
  }
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
