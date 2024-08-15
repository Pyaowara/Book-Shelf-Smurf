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
  port: 3306
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

app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const query = `
    SELECT book_detail.*, book_description.description, author.author_name
    FROM book_detail
    LEFT JOIN book_description ON book_detail.book_description_id = book_description.book_description_id
    LEFT JOIN author ON book_detail.author_id = author.author_id
    WHERE book_detail.book_id = ?`; // Fixing the column name to 'book_id' instead of 'book_description_id'

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
  const query = 'SELECT * FROM book_description WHERE book_id = ?'; // Use the correct column

  db.query(query, [bookId], (err, results) => {
    if (err) {
      console.error('Error fetching description:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results[0] || {});
  });
});

app.get('/searched', (req, res) => {
  const name = req.query.name || ''; // Ensure that name is not undefined
  if (!name.trim()) {
    res.status(400).json({ error: 'Search query cannot be empty' });
    return;
  }

  const query = `
    SELECT * FROM book_detail
    WHERE book_name_en LIKE ? OR book_name_originl LIKE ?`;

  db.query(query, [`%${name}%`, `%${name}%`], (err, results) => {
    if (err) {
      console.error('Error executing search:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'No books found for the search query' });
    } else {
      res.json(results);
    }
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
