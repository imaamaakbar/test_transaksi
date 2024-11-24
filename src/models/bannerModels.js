const db = require('../../configs/db');

// Fungsi untuk mengambil semua banner
const getAllBanners = async () => {
  try {
    const rows = await db.query('SELECT * FROM banner where 1=1');
    return rows; // Mengembalikan semua data user
  } catch (error) {
    throw new Error('Error fetching users: ' + error.message);
  }
};

module.exports = {
  getAllBanners,
};
