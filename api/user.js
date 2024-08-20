const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  port: 3306,
});

module.exports = async (req, res) => {
  switch (req.method) {
    case 'POST':
      if (req.url.includes('/register')) {
        // Register
        const { user_email, user_name, user_pass, user_phone } = req.body;
        if (!user_email || !user_name || !user_pass || !user_phone) {
          return res.status(400).send('All fields are required');
        }
        try {
          const passwordHash = await bcrypt.hash(user_pass, 8);
          await pool.query('INSERT INTO user (user_email, user_name, user_pass, user_permission, user_phone) VALUES (?, ?, ?, ?, ?)', [user_email, user_name, passwordHash, 1, user_phone]);
          res.status(201).send('User registered');
        } catch (err) {
          console.error('Database error:', err);
          res.status(500).send(err.message);
        }
      } else if (req.url.includes('/login')) {
        // Login
        const { user_name, user_pass } = req.body;
        if (!user_name || !user_pass) {
          return res.status(400).json({ message: 'Username and password are required' });
        }
        try {
          const [users] = await pool.query('SELECT * FROM user WHERE user_name = ? OR user_email = ?', [user_name, user_name]);
          const userData = users[0];
          const match = await bcrypt.compare(user_pass, userData.user_pass);
          if (match) {
            const token = jwt.sign({ user_id: userData.user_id, user_name: userData.user_name, user_permission: userData.user_permission }, 'itkmitl', { expiresIn: '30d' });
            res.status(200).json({ message: 'Login successful', userToken: token, name_user: userData.user_name });
          } else {
            res.status(401).json({ message: 'Invalid username or password' });
          }
        } catch (err) {
          console.error('Database error:', err);
          res.status(500).send(err.message);
        }
      } else if (req.url.includes('/getUserProfile')) {
        // Get user profile
        const { token } = req.body;
        if (!token) {
          return res.status(400).json({ message: 'Token is required' });
        }
        try {
          const user = jwt.verify(token, 'itkmitl');
          const [result] = await pool.query('SELECT * FROM user WHERE user_name = ?', [user.user_name]);
          res.status(200).json(result[0]);
        } catch (err) {
          console.error('Database error:', err);
          res.status(500).send(err.message);
        }
      } else if (req.url.includes('/validate-token')) {
        // Validate token
        const { token } = req.body;
        try {
          const user = jwt.verify(token, 'itkmitl');
          res.status(200).json({ valid: true, name: user.user_name });
        } catch (error) {
          res.status(200).json({ valid: false, name: '' });
        }
      }
      break;
    default:
      res.status(405).json({ error: 'Method Not Allowed' });
  }
};
