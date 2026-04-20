require('dotenv').config();
const mysql = require('mysql2');

// Create a connection to Railway MySQL
const connection = mysql.createConnection({
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'railway',
  port: 52371
});

// Connect
connection.connect(err => {
  if (err) {
    console.error('❌ DB connection failed:', err);
  } else {
    console.log('✅ Connected to Railway MySQL');
  }
});

module.exports = connection;