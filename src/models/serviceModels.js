const db = require('../../configs/db');

// Fungsi untuk mengambil semua banner
const getAllServices = async () => {
  try {
    const rows = await db.query('SELECT service_code,service_name,service_icon,service_tariff FROM service where 1=1');
    return rows; // Mengembalikan semua data user
  } catch (error) {
    throw new Error('Error fetching users: ' + error.message);
  }
};

const getServices = async (service_code) => {
  try {
    const [row] = await db.query('SELECT service_code,service_name,service_icon,service_tariff FROM service where service_code = ? limit 1'
      ,[service_code]);
    return row; 
  } catch (error) {
    throw new Error('Error fetching users: ' + error.message);
  }
};

module.exports = {
  getAllServices, getServices
};
