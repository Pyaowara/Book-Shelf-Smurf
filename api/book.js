const mysql = require('mysql2');
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

module.exports = async (req, res) => {
  switch (req.method) {
    case 'GET':
      if (req.query.id) {
        // Book details
        const bookId = req.query.id;
        const query = `SELECT book_detail.*, author.author_name 
                       FROM book_detail 
                       LEFT JOIN author ON book_detail.author_id = author.author_id 
                       WHERE book_detail.book_id = ?`;
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
      } else if (req.query.seriesId) {
        // Books by series
        const seriesId = req.query.seriesId;
        const query = `SELECT book_detail.*, author.author_name 
                       FROM book_detail 
                       LEFT JOIN author ON book_detail.author_id = author.author_id 
                       WHERE book_detail.serie_id = ?`;
        db.query(query, [seriesId], (err, results) => {
          if (err) {
            console.error('Error fetching books by series:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          res.json(results);
        });
      } else if (req.query.name) {
        // Search
        const name = req.query.name || '';
        if (!name.trim()) {
          return res.status(400).json({ error: 'Search query cannot be empty' });
        }
        const query = `SELECT * FROM book_detail 
                       WHERE book_name_en LIKE ? OR book_name_originl LIKE ?`;
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
      } else {
        // All books
        const query = `SELECT * FROM book_detail 
                       WHERE serie_id = 1 OR book_id IN 
                       (SELECT MIN(book_id) FROM book_detail 
                        WHERE serie_id != 1 GROUP BY serie_id)`;
        db.query(query, (err, results) => {
          if (err) {
            console.error('Error fetching books:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          res.json(results);
        });
      }
      break;
    case 'POST':
      if (req.url.includes('/comments/')) {
        // Upvote or downvote
        const commentId = req.url.split('/')[3];
        const action = req.url.includes('/upvote') ? 'up_vote' : 'down_vote';
        const query = `UPDATE comment SET ${action} = ${action} + 1 WHERE comment_id = ?`;
        db.query(query, [commentId], (err) => {
          if (err) {
            console.error(`Error ${action} comment:`, err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          res.status(200).json({ message: `${action.replace('_', ' ')} successful` });
        });
      }
      break;
    default:
      res.status(405).json({ error: 'Method Not Allowed' });
  }
};
