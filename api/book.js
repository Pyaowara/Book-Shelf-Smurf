const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const port = 8000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'book',
    port: 3306
});

app.use(express.json());
app.use(cors())

app.post('/register', async (req, res) => {
    const { user_email, user_name, user_pass, user_phone} = req.body;
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
    }
    finally{
        if(conn){
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

        if(match){
            const token = jwt.sign({user_id: userData.user_id, 
                                    user_name: userData.user_name,
                                    user_permission: userData.user_permission}, 
                                    'itkmitl', {expiresIn: '30d'});
            res.status(200).json({
            message: 'Login successful',
            userToken: token,
            name_user: userData.user_name
            });
        }else {
            res.status(401).json({
                message: 'Invalid username or password',
            });
        }
    }
    catch (err) {
        console.error('Database error:', err);
        res.status(500).send(err.message);
    }
    finally{
        if(conn){
            conn.release();
        }
    }
});

app.post('/getUserProfile', async(req, res) => {
    const { token } = req.body;
    console.log('Received token:', token);
    if (!token) {
        return res.status(400).json({
            message: 'Token are required',
        });
    }
    const query = 'SELECT * FROM user WHERE user_name = ?';
    let conn;

    try {
        conn = await pool.getConnection();
        const user = jwt.verify(token, 'itkmitl');
        const [result] = await conn.query(query, user.user_name);
        res.status(200).json(result[0]);
    }
    catch (err) {
        console.error('Database error:', err);
        res.status(500).send(err.message);
    }
    finally{
        if(conn){
            conn.release();
        }
    }
});

app.post('/validate-token', async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, 'itkmitl');
        res.status(200).json({valid: true, name: user.user_name});
    } catch (error) {
        res.status(200).json({valid: false, name: ''})
    }
});

app.listen(port, () => {
    console.log('HTTP server running at port ' + port);
    console.log("Connect to user DB");
});