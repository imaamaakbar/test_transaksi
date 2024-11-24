const jwt = require('jsonwebtoken');

const tokenAuth = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        status: 108,
        message: "Token tidak  valid atau kadaluwarsa",
        data: null
      });
    }

    req.user = user; 
    next();
  });
}

module.exports ={tokenAuth}