const express = require('express');
const { registerUser,  loginUser, getProfile, updateUser, updatePhoto } = require('../controllers/userControllers');
const { fetchBanners,fetchServices } = require('../controllers/informationControllers');
const {  getBalances,userTopup, userTransaksi, getHistoryTransaksi } = require('../controllers/transactionControllers');

const { upload } = require('../middlewares/uploadMiddleware');
const { tokenAuth } = require('../middlewares/tokenAuthMiddleware');

const router = express.Router();

// Modul Memberships
router.post('/registration', registerUser);
router.post('/login',loginUser);
router.get('/profile',tokenAuth ,getProfile);
router.put('/profile/update',tokenAuth  ,updateUser);
router.put('/profile/image', tokenAuth, upload.single('file'),(err, req, res, next) => {
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
router.get('/banner', tokenAuth ,fetchBanners);
router.get('/services', tokenAuth , fetchServices);

// Modul Transaksi
router.get('/balance', tokenAuth , getBalances);
router.post('/topup',tokenAuth,userTopup)
router.post('/transaksi',tokenAuth,userTransaksi)
router.get('/transaksi/history',tokenAuth,getHistoryTransaksi)

module.exports = router;

