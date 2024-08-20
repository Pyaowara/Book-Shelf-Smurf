const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/books', (req, res) => {
  const query = `
    SELECT * FROM book_detail 
    WHERE serie_id = 1 
    OR book_id IN (
      SELECT MIN(book_id) 
      FROM book_detail 
      WHERE serie_id != 1
      GROUP BY serie_id
    )
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching books:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const query = `
    SELECT book_detail.*, author.author_name
    FROM book_detail
    LEFT JOIN author ON book_detail.author_id = author.author_id
    WHERE book_detail.book_id = ?
  `;

  db.query(query, [bookId], (err, results) => {
    if (err) {
      console.error('Error fetching book details:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(results[0]);
  });
});

app.get('/searched', (req, res) => {
  const name = req.query.name || '';
  if (!name.trim()) {
    return res.status(400).json({ error: 'Search query cannot be empty' });
  }

  const query = `
    SELECT * FROM book_detail
    WHERE book_name_en LIKE ? OR book_name_originl LIKE ?
  `;

  db.query(query, [`%${name}%`, `%${name}%`], (err, results) => {
    if (err) {
      console.error('Error executing search:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No books found for the search query' });
    }
    res.json(results);
  });
});

app.get('/books/series/:seriesId', (req, res) => {
  const seriesId = req.params.seriesId;
  const query = `
    SELECT book_detail.*, author.author_name
    FROM book_detail
    LEFT JOIN author ON book_detail.author_id = author.author_id
    WHERE book_detail.serie_id = ?
  `;

  db.query(query, [seriesId], (err, results) => {
    if (err) {
      console.error('Error fetching books by series:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

app.get('/books/:id/comments', (req, res) => {
  const bookId = req.params.id;
  const query = `
    SELECT comment.comment_id, comment.user_id, comment.book_id, comment.comment_detail, comment.reply_id, comment.up_vote, comment.down_vote, comment.time_stamp, user.user_name
    FROM comment
    LEFT JOIN user ON comment.user_id = user.user_id
    WHERE comment.book_id = ?
  `;

  db.query(query, [bookId], (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

app.post('/comments/:commentId/upvote', (req, res) => {
  const commentId = req.params.commentId;
  const query = `
    UPDATE comment
    SET up_vote = up_vote + 1
    WHERE comment_id = ?
  `;

  db.query(query, [commentId], (err) => {
    if (err) {
      console.error('Error upvoting comment:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json({ message: 'Upvote successful' });
  });
});

app.post('/comments/:commentId/downvote', (req, res) => {
  const commentId = req.params.commentId;
  const query = `
    UPDATE comment
    SET down_vote = down_vote + 1
    WHERE comment_id = ?
  `;

  db.query(query, [commentId], (err) => {
    if (err) {
      console.error('Error downvoting comment:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json({ message: 'Downvote successful' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
