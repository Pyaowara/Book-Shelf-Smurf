const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
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
app.use(cookieParser())
app.use(cors({
    //ปรับตรงorigin เป็นpath ปัจจุบันที่ใช้
    origin: ['https://books-spark.vercel.app', 'http://localhost:4200'],
    credentials: true
}));

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
        return res.status(400).json({
            message: 'Username and password are required',
        });
    }

    try {
        const conn = await pool.getConnection();
        const [username] = await conn.query('SELECT * FROM users_info WHERE users_username = ?', [users_username]);
        const userData = username[0];
        const match = await bcrypt.compare(users_password, userData.users_password);

        if (match) {
            const token = jwt.sign({users_username}, 'itkmitl');
            res.cookie('token', token, {
                maxAge: 300000,
                secure: false,
                httpOnly: true,
                sameSite: "lax",
            })

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

app.get('/verify', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'itkmitl', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(200).json({
            message: 'Token is valid',
            username: decoded.users_username,
        });
    });
});

app.listen(port, () => {
    console.log('HTTP server running at port ' + port);
    console.log("Connect to user DB");
});
