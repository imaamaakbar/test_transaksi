const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user_${req.user.email}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error('Format Image tidak sesuai');
        error.status = 102;
        return cb(error);
      }
    cb(null, true);
  }
});

module.exports = {upload};
