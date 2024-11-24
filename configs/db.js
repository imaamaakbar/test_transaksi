const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


module.exports = {pool,
  query: (sql, params) => {
    return new Promise((resolve, reject) => {
      pool.query(sql, params, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    })
  }
};