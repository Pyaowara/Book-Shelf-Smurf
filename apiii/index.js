const express = require('express');
const mysql = require('mysql');
const mysql2 = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_ROOT,
  password: process.env.DB_PASS,
  database: 'book',
  port: 3306,
});

db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
      return;
    }
    console.log('Connected to MySQL database');
  });

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_ROOT,
  password: process.env.DB_PASS,
  database: 'book',
  port: 3306,
});

app.get("/t", (req, res) => res.send("Express on Vercel"));

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

app.post('/register', async (req, res) => {
  const { user_email, user_name, user_pass, user_phone } = req.body;
  let conn;

  if (!user_email || !user_name || !user_pass || !user_phone) {
    return res.status(400).send('All fields are required');
  }
  try {
    conn = await pool.getConnection();
    const passwordHash = await bcrypt.hash(user_pass, 8);
    await conn.query('INSERT INTO user (user_email, user_name, user_pass, user_permission, user_phone) VALUES (?, ?, ?, ?, ?)', [user_email, user_name, passwordHash, 1, user_phone]);
    res.status(201).send('User registered');
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send(err.message);
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.post('/login', async (req, res) => {
  const { user_name, user_pass } = req.body;
  let conn;

  if (!user_name || !user_pass) {
    return res.status(400).json({
      message: 'Username and password are required',
    });
  }
  try {
    conn = await pool.getConnection();
    const [users] = await conn.query('SELECT * FROM user WHERE user_name = ? OR user_email = ?', [user_name, user_name]);
    const userData = users[0];
    const match = await bcrypt.compare(user_pass, userData.user_pass);

    if (match) {
      const token = jwt.sign(
        {
          user_id: userData.user_id,
          user_name: userData.user_name,
          user_permission: userData.user_permission,
        },
        'itkmitl',
        { expiresIn: '30d' }
      );
      res.status(200).json({
        message: 'Login successful',
        userToken: token,
        name_user: userData.user_name,
      });
    } else {
      res.status(401).json({
        message: 'Invalid username or password',
      });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send(err.message);
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.post('/getUserProfile', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({
      message: 'Token is required',
    });
  }
  const query = 'SELECT * FROM user WHERE user_name = ?';
  let conn;

  try {
    conn = await pool.getConnection();
    const user = jwt.verify(token, 'itkmitl');
    const [result] = await conn.query(query, user.user_name);
    res.status(200).json(result[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send(err.message);
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.post('/validate-token', async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, 'itkmitl');
    res.status(200).json({ valid: true, name: user.user_name });
  } catch (error) {
    res.status(200).json({ valid: false, name: '' });
  }
});

app.get('/getUserProfile/:id', async(req, res) => {
  const user_name = req.params.id;

  let conn;

  if (!user_name) {
    return res.status(400).send('Username is required');
  }

  try {
    conn = await pool.getConnection();

    const [rows] = await conn.query('SELECT * FROM user WHERE user_name = ?', [user_name]);

    if (rows.length === 0) {
      return res.status(404).send('User not found');
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send(err.message);
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.post('/change/:id', async (req, res) => {
  const id = req.params.id;
  let {user_id, data, password} = req.body;
  let conn;

  if (!data || !password || !user_id) {
    return res.status(400).json({
      message: 'Information are required',
    });
  }
  try {
    conn = await pool.getConnection();

    let [users] = await conn.query('SELECT * FROM user WHERE user_id = ?', [user_id]);
    if (users.length === 0) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    let userData = users[0];
    const match = await bcrypt.compare(password, userData.user_pass);

    if (match) {
      if (id === 'user_name' || id === 'user_email') {
        let column = id === 'user_name' ? 'user_name' : 'user_email';
        let [existingUsers] = await conn.query(`SELECT * FROM user WHERE ${column} = ?`, [data]);

        if (existingUsers.length > 0) {
          return res.status(409).json({
            message: `${column === 'user_name' ? 'Username' : 'Email'} already exists`,
          });
        }
      }

      const queryChange = 'UPDATE user SET ?? = ? WHERE user_id = ?';
      if(id == 'user_pass'){
        data = await bcrypt.hash(data, 8);
      }
      await conn.query(queryChange, [id, data, user_id]);
      [users] = await conn.query('SELECT * FROM user WHERE user_id = ?', [user_id]);
      userData = users[0];

      const token = jwt.sign(
        {
          user_id: userData.user_id,
          user_name: userData.user_name,
          user_permission: userData.user_permission,
        },
        'itkmitl',
        { expiresIn: '30d' }
      );

      res.status(200).json({
        message: 'User information updated successfully',
        userToken: token,
        name_user: userData.user_name,
      });
    } else {
      res.status(401).json({
        message: 'Invalid password',
        userToken: '',
        name_user: '',
      });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send(err.message);
  } finally {
    if (conn) {
      conn.release();
    }
  }
});
app.post('/comments/add', (req, res) => {
  const { book_id, comment_detail, user_id } = req.body;
  const query = 'INSERT INTO comment (book_id, comment_detail, user_id) VALUES (?, ?, ?)';
  
  db.query(query, [book_id, comment_detail, user_id], (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(201).send({ message: 'Comment added successfully!' });
  });
});

app.post('/getUserId', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, 'itkmitl');
    res.status(200).json({ userId: decoded.user_id });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

app.delete('/comments/delete/:commentId', async (req, res) => {
  const commentId = req.params.commentId;
  const { userId } = req.body;

  if (!commentId || !userId) {
    return res.status(400).json({ message: 'Comment ID and User ID are required' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT user_id FROM comment WHERE comment_id = ?', [commentId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }
    await conn.query('DELETE FROM comment WHERE comment_id = ?', [commentId]);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});


module.exports = app;
