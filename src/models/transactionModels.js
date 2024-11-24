const db = require('../../configs/db');
const userTopupModel = {
    
  insertTransaction: (connection, data) => {
    const query = `INSERT INTO transaksi (id_user, invoice_number,transaction_type, description, total_amount, created_on) VALUES (?, ?, ?, ?, ?, NOW(3))`;
    return new Promise((resolve, reject) => {
      connection.query(
        query,
        [data.id_user, data.invoice_number, data.transaction_type, data.description, data.total_amount],
        (err, results) => {
          if (err) return reject(err);
          resolve(results.insertId); // Kembalikan ID user yang baru dibuat
        }
      );
    });
  },

  updateUserBalance: (connection, total_amount, id) => {
    const query = `UPDATE user SET balance = balance + ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      connection.query(query, [total_amount, id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

};

const userTransactionModel = {
    
  insertTransaction: (connection, data) => {
    const query = `INSERT INTO transaksi (id_user, invoice_number,transaction_type, description, total_amount, created_on) VALUES (?, ?, ?, ?, ?, NOW(3))`;
    return new Promise((resolve, reject) => {
      connection.query(
        query,
        [data.id_user, data.invoice_number, data.transaction_type, data.description, data.total_amount],
        (err, results) => {
          if (err) return reject(err);
          resolve(results.insertId); // Kembalikan ID user yang baru dibuat
        }
      );
    });
  },

  updateUserBalance: (connection, total_amount, id) => {
    const query = `UPDATE user SET balance = balance - ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      connection.query(query, [total_amount, id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
};

const getBalanceUser = async (email) => {
  try {
    const row = await db.query('SELECT balance FROM user WHERE email = ? limit 1'
      ,[email]);
      
    return row[0]; 
  } catch (error) {
    throw new Error('Error fetching users: ' + error.message);
  }
};

const getInfoTransaksi = async (id) => {
  try {
    const row = await db.query('SELECT * FROM transaksi WHERE id = ? limit 1'
      ,[id]);
      
    return row[0]; 
  } catch (error) {
    throw new Error('Error fetching users: ' + error.message);
  }
};

const getHistoryTransaksiModel = async (limit, offset = 0,id_user) => {
  try {
    var row = [];
   if(!limit){
    row = await db.query('SELECT invoice_number,transaction_type,description,total_amount,created_on FROM transaksi where id_user = ?  ORDER BY created_on DESC',[id_user]
      );
   }else{
    row = await db.query('SELECT invoice_number,transaction_type,description,total_amount,created_on FROM transaksi where id_user = ? ORDER BY created_on DESC limit ? offset ?'
      ,[id_user,limit,offset]);
   }
      
    return row; 
  } catch (error) {
    throw new Error('Error fetching users: ' + error.message);
  }
}

module.exports = {
    userTopupModel, getBalanceUser,userTransactionModel,getInfoTransaksi,getHistoryTransaksiModel
};
