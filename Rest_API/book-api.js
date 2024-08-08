const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bookv2',
  port: 3306 //ใครจะใช้เปลี่ยนเป็น port ที่รัน mysql ก่อน
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

app.get('/book_description', (req, res) => {
  const bookId = req.query.book_id;
  const query = 'SELECT * FROM book_description WHERE book_description_id = ?';

  db.query(query, [bookId], (err, results) => {
    if (err) throw err;
    res.json(results[0] || {}); // Send first result or empty object if no result
  });
});

app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const query = `
    SELECT book_detail.*, book_description.description, author.author_name
    FROM book_detail
    LEFT JOIN book_description ON book_detail.book_description_id = book_description.book_description_id
    LEFT JOIN author ON book_detail.author_id = author.author_id
    WHERE book_detail.book_description_id = ?`;

  db.query(query, [bookId], (err, results) => {
    if (err) {
      console.error('Error fetching book details:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.json(results[0]);
  });
});

app.get('/book_description', (req, res) => {
  const bookId = req.query.book_id;
  const query = 'SELECT * FROM book_description WHERE book_id = ?';

  db.query(query, [bookId], (err, results) => {
    if (err) {
      console.error('Error fetching description:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results[0] || {});
  });
});
