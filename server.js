const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'book'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.get('/books', (req, res) => {
  const query = 'SELECT * FROM book_detail';
  
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
