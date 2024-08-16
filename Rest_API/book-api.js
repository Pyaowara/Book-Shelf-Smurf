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
  database: 'book',
  port: 3306
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
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
    if (err) throw err;
    res.json(results);
  });
});



app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const query = `
    SELECT book_detail.*, author.author_name
    FROM book_detail
    LEFT JOIN author ON book_detail.author_id = author.author_id
    WHERE book_detail.book_id = ?`;

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

app.get('/searched', (req, res) => {
  const name = req.query.name || '';
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

app.get('/books/series/:seriesId', (req, res) => {
  const seriesId = req.params.seriesId;
  const query = `
    SELECT book_detail.*, author.author_name
    FROM book_detail
    LEFT JOIN author ON book_detail.author_id = author.author_id
    WHERE book_detail.serie_id = ?`;

  db.query(query, [seriesId], (err, results) => {
    if (err) {
      console.error('Error fetching books by series:', err.message);
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
      return;
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
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
      return;
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
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
      return;
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
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
      return;
    }
    res.status(200).json({ message: 'Downvote successful' });
  });
});
