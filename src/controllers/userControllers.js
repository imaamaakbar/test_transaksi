const jwt = require('jsonwebtoken');
const { insertUser,getUser,updateUserModel,getInfoUser, updatePhotoProfileModel } = require('../models/userModels');
const { validateRegistration, validateLogin,validateUpdateUser } = require('../validations/userValidations');
const { comparePassword } = require('../utils/hashUtils');
const fs = require('fs');
const path = require('path');


const registerUser = async (req, res) => {
  
  try {
    const isnotvalid = validateRegistration(req.body);
    if(isnotvalid){
      res.status(400).json(
        {
          "status": 102,
          "message": isnotvalid,
          "data": null
        });
    }else{
      const userId = await insertUser(req.body);
      res.status(200).json({
        "status": 0,
        "message": "Registrasi berhasil silahkan login",
        "data": null
      });
    }    
  } catch (error) {
    res.status(500).json(
      {
        "status": 500,
        "message": error.message,
        "data": null
      });
  }
};

const updatePhoto = async (req, res) => {
  try{

  
  const data_user = await getInfoUser(req.user.email);
  const userId = data_user.id; 
  const photo = req.file;

  if (!photo) {
    return res.status(400).json({ 
      "status": 102,
      "message": "Foto tidak boleh kosong",
      "data": null
     });
  }
    const oldPhoto = data_user.profile_image;

    if (oldPhoto) {
      const oldPhotoPath = path.join(__dirname, '../public/uploads/', oldPhoto);
      fs.unlink(oldPhotoPath, (err) => {
        if(err){
          throw new Error(err);
        }
       
      });
    }

    await updatePhotoProfileModel(userId,photo.filename);
      res.status(200).json({
        status: 0,
        message: "Update Profile Image berhasil",
        data: {
          email: data_user.email,
          first_name: data_user.first_name,
          last_name: data_user.last_name,
          profile_image:  `${req.protocol}://${req.get('host')}/${photo.filename}`
        }
      });
    }catch(error){
      return res.status(500).json({ 
        "status": 500,
        "message": error.message,
        "data": null
       });
    }
};

const updateUser = async (req, res) => {
  
  try {
    const isnotvalid =  validateUpdateUser(req.body);
    if(isnotvalid){
      res.status(400).json(
        {
          "status": 102,
          "message": isnotvalid,
          "data": null
        });
    }else{
      const email = req.user.email;
      const data_user = await getInfoUser(email);
      await updateUserModel(req.body,data_user.id);
      var user = await getUser(email);
      user.profile_image = user.profile_image ?  `${req.protocol}://${req.get('host')}/${user.profile_image}`  : null ;
      delete user.password;
  
      res.status(200).json({
        "status": 0,
        "message": "Update Pofile berhasil",
        "data": user
      });
    }
   
  } catch (error) {
    res.status(500).json(
      {
        "status": 500,
        "message": error.message,
        "data": null
      });
  }
};

const getProfile = async (req,res) => {
  try {
    const email = req.user.email;
    var user = await getUser(email);
    user.profile_image = user.profile_image ?  `${req.protocol}://${req.get('host')}/${user.profile_image}`  : null ;
    delete user.password;

    res.status(200).json ({
      status: 0,
      message: "Sukses",
      data: user
    })
  }catch (error) {
    res.status(500).json(
      {
        "status": 500,
        "message": error.message,
        "data": null
      });
  }


}

const loginUser = async (req, res) => {
  try {
    var ismailtrue = false;
    var ispasstrue = false;
    var isnotvalid = validateLogin(req.body);
    if(isnotvalid){
      res.status(400).json(
        {
          "status": 102,
          "message": error.message,
          "data": null
        });
    }else{
      const email = req.body.email
    const user = await getUser(email);
    if(user){
      var ismailtrue = true;
      var ispasstrue = await comparePassword(req.body.password, user.password)
    }

    if(ismailtrue && ispasstrue){
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
      );    
      res.status(200).json ({
        status: 0,
        message: "Login Sukses",
        data: {
          token: token
        }
      })
    }else{
      res.status(201).json(
        {
          status: 103,
          message: "Username atau password salah",
          data: null
        }
      )
    }

    }
    
  } catch(error){
    res.status(500).json(
      {
        "status": 500,
        "message": error.message,
        "data": null
      });
  }
  
};

module.exports = {
  registerUser,
   loginUser,getProfile,updateUser,updatePhoto
};
