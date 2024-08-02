const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const mysql = require('mysql2/promise');
const cors = require('cors');

const port = 8000;

const pool = mysql.createPool({
    //ปรับตาม port database ของตัวเองนะจั๊บ
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'users',
    port: 3308
});

app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) => {
    const { users_email, users_username, users_password} = req.body;

    if (!users_email || !users_username || !users_password) {
        return res.status(400).send('All fields are required');
    }
    const passwordHash = await bcrypt.hash(users_password, 10)
    try {
        const conn = await pool.getConnection();
        await conn.query('INSERT INTO users_info (users_email, users_username, users_password) VALUES (?, ?, ?)', [users_email, users_username, passwordHash]);
        res.status(201).send('User registered');
        conn.release();
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send(err.message);
    }
});

app.post('/login', async (req, res) => {
    const { users_username, users_password } = req.body;

    if (!users_username || !users_password) {
        return res.status(400).send('Username and password are required');
    }
    
    try {
        const conn = await pool.getConnection();
        const [username] = await conn.query('SELECT * FROM users_info WHERE users_username = ?', users_username)
        const userData = username[0]
        const match = await bcrypt.compare(users_password, userData.users_password)
        
        if (match) {
            res.status(200).send('Login successful');
        }
        else {
            res.status(401).send('Invalid username or password');
        }

        conn.release();
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log('HTTP server running at port ' + port);
    console.log("Connect to user DB");
});