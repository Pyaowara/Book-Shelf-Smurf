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
    const { user_email, user_name, user_pass, user_phone} = req.body;
    let conn;

    if (!user_email || !user_name || !user_pass || !user_phone) {
        return res.status(400).send('All fields are required');
    }
    try {
        conn = await pool.getConnection();
        await conn.query('INSERT INTO user (user_email, user_name, user_pass, user_permission, user_phone) VALUES (?, ?, ?, ?, ?)', [user_email, user_name, user_pass, 1, user_phone]);
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
        const [user] = await conn.query('SELECT * FROM user WHERE user_name = ? AND user_pass = ?', [user_name, user_pass]);
      

        if (user.length > 0) {
            res.status(200).json({
                message: 'Login successful',
                userId: user[0].user_id,
                userName: user[0].user_name,
                userEmail: user[0].user_email,
                userPhone: user[0].user_phone,
                userPermission: user[0].user_permission,
                userImage: user[0].user_image,
                userDescriptions: user[0].user_descriptions,
                userPass: user[0].user_pass
            });
        }
        else {
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

app.get('/get-user/:username', async(req, res) => {
    const username = req.params.username;
    const query = 'SELECT * FROM user WHERE user_name = ?';
    let conn;

    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(query, username);
        res.status(200).json(result);
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



app.listen(port, () => {
    console.log('HTTP server running at port ' + port);
    console.log("Connect to user DB");
});
