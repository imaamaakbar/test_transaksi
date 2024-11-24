const db = require('../../configs/db');
const {hashPassword} = require('../utils/hashUtils')


const insertUser = async (data) => {
  try {
    const result = await db.query(
      'INSERT INTO user (first_name, last_name,email, password) VALUES (?, ?, ?, ?)',
      [data.first_name, data.last_name,data.email, await hashPassword( data.password)]
    );
    return result.insertId; 
  } catch (error) {
    throw new Error('Error  : ' + error.message);
  }
};

const updateUserModel = async (data,id) => {
 try {
    await db.query(
     'UPDATE user SET first_name = ? ,last_name = ? WHERE id = ?',
     [data.first_name, data.last_name,id]
   );
 } catch (error) {
   throw new Error('Error : ' + error.message);
 }
};

const getUser = async (email) => {
    try {
      const [row] = await db.query('SELECT first_name,last_name,email,profile_image,password FROM user where email = ? limit 1'
        ,[email]);
      return row; 
    } catch (error) {
      throw new Error('Error : ' + error.message);
    }
  };

const getInfoUser = async (email) => {
    try {
        const [row] = await db.query('SELECT id,first_name,last_name,email,profile_image,balance FROM user where email = ? limit 1'
          ,[email]);
        return row; 
      } catch (error) {
        throw new Error('Error : ' + error.message);
      }
    }; 


const updatePhotoProfileModel = async (id,file_name) => {
  try {
    await db.query('UPDATE user SET profile_image = ? WHERE id = ?'
      ,[file_name,id]); 
  } catch (error) {
    throw new Error('Error : ' + error.message);
  }

}

  


module.exports = {
  insertUser,
  getInfoUser, getUser,updateUserModel,updatePhotoProfileModel
};


