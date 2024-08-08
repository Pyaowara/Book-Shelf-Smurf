const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const mysql = require('mysql2/promise');
const cors = require('cors');
const port = 8000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bookv2',
    port: 3306
});

app.use(express.json());
app.use(cors())

app.post('/register', async (req, res) => {
    const { user_email, user_name, user_pass} = req.body;

    if (!user_email || !user_name || !user_pass) {
        return res.status(400).send('All fields are required');
    }
    try {
        const conn = await pool.getConnection();
        await conn.query('INSERT INTO user (user_email, user_name, user_pass) VALUES (?, ?, ?)', [user_email, user_name, user_pass]);
        res.status(201).send('User registered');
        conn.release();
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send(err.message);
    }
});

app.post('/login', async (req, res) => {
    const { user_name, user_pass } = req.body;
    
    if (!user_name || !user_pass) {
        return res.status(400).json({
            message: 'Username and password are required',
        });
    }
    try {
        const conn = await pool.getConnection();
        const [user] = await conn.query('SELECT * FROM user WHERE user_name = ? AND user_pass = ?', [user_name, user_pass]);
      

        if (user.length > 0) {
            res.status(200).json({
                message: 'Login successful',
            });
        }
        else {
            res.status(401).json({
                message: 'Invalid username or password',
            });
        }

        conn.release();
    }
    catch (err) {
        console.error('Database error:', err);
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log('HTTP server running at port ' + port);
    console.log("Connect to user DB");
});
