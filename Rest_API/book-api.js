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
  database: 'bookv2',
  port: 3306 //ใครจะใช้เปลี่ยนเป็น port ที่รัน mysql ก่อน
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.get('/books', (req, res) => {
  const query = 'SELECT * FROM book_detail';
  
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
