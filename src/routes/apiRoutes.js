const express = require('express');
const { registerUser,  loginUser, getProfile, updateUser, updatePhoto } = require('../controllers/userControllers');
const { fetchBanners,fetchServices } = require('../controllers/informationControllers');
const {  getBalances,userTopup, userTransaksi, getHistoryTransaksi } = require('../controllers/transactionControllers');
const { authenticateToken } = require('../middlewares/authmiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Modul Memberships
router.post('/registration', registerUser);
router.post('/login',loginUser);
router.get('/profile',authenticateToken ,getProfile);
router.put('/profile/update',authenticateToken ,updateUser);
router.put('/profile/image', authenticateToken, upload.single('file'),(err, req, res, next) => {
    if (err) {
      return res.status(400).json({
        status: err.status || 400,
        message: err.message || 'File upload error',
        data: null,
      });
    }
    next();
  }, updatePhoto);
// Modul Information
router.get('/banner', authenticateToken ,fetchBanners);
router.get('/services', authenticateToken , fetchServices);

// Modul Transaksi
router.get('/balance', authenticateToken , getBalances);
router.post('/topup',authenticateToken,userTopup)
router.post('/transaksi',authenticateToken,userTransaksi)
router.get('/transaksi/history',authenticateToken,getHistoryTransaksi)

module.exports = router;

