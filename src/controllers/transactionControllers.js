const db = require("../../configs/db");
const { getServices } = require("../models/serviceModels");
const { userTopupModel,getBalanceUser, userTransactionModel, getInfoTransaksi, getHistoryTransaksiModel } = require("../models/transactionModels");
const { getInfoUser} = require("../models/userModels");
const { generateInvNumber } = require("../utils/invUtils");
const { validateUserTopup } = require("../validations/transactionValidations");



const userTopup =  async (req, res) => {
    const validate_params = validateUserTopup(req.body)
    if(validate_params){
        res.status(400).json({
          status: 102,
          message: validate_params,
          data: null
        }
      );
    }
    
    const top_up_amount = req.body.top_up_amount;

    const connection = await new Promise((resolve, reject) => {
      db.pool.getConnection((err, connection) => {
        if (err) return reject(err);
        resolve(connection);
      });
    });

    try {
      
      const email = req.user.email;
      const data_user = await getInfoUser(email);
      const inv_gen = await generateInvNumber();
      await new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      await userTopupModel.insertTransaction(connection, {
        id_user : data_user.id, 
        invoice_number : inv_gen, 
        transaction_type : "TOPUP", 
        description : "Top Up balance", 
        total_amount : top_up_amount,
        
      });

      await userTopupModel.updateUserBalance(connection, top_up_amount, data_user.id );

      await new Promise((resolve, reject) => {
        connection.commit((err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      connection.release();
      const data_balance = await getBalanceUser(email);
      res.status(200).json({
        status: 0,
        message: "Top Up Balance berhasil",
        data: data_balance
      });
    } catch (error) {
      await new Promise((resolve, reject) => {
        connection.rollback((err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      connection.release();

      res.status(500).json({ error: error.message });
    }
  
};

const userTransaksi =  async (req, res) => {
  const service_code = req.body.service_code;
  const data_service = await getServices(service_code);
  if(data_service == undefined){
    res.status(400).json({
      status: 102,
      message: "Service ataus Layanan tidak ditemukan",
      data: null
    }
  );
  }else{
    const email = req.user.email;
    const data_user = await getInfoUser(email);
    if(data_user.balance < data_service.service_tariff){
      res.status(400).json({
        status: 102,
        message: "Saldo tidak mencukupi",
        data: null
      });
    }else{
      const connection = await new Promise((resolve, reject) => {
        db.pool.getConnection((err, connection) => {
          if (err) return reject(err);
          resolve(connection);
        });
      });
  
      try {
        const email = req.user.email;
        const data_user = await getInfoUser(email);
        const inv_gen = await generateInvNumber();
        await new Promise((resolve, reject) => {
          connection.beginTransaction((err) => {
            if (err) return reject(err);
            resolve();
          });
        });

       const id_input = await userTransactionModel.insertTransaction(connection, {
          id_user : data_user.id, 
          invoice_number : inv_gen, 
          transaction_type : "PAYMENT", 
          description : data_service.service_name, 
          total_amount : data_service.service_tariff,
        
        });
        

        
        await userTransactionModel.updateUserBalance(connection, data_service.service_tariff , data_user.id );

        await new Promise((resolve, reject) => {
          connection.commit((err) => {
            if (err) return reject(err);
            resolve();
          });
        });

        connection.release();
        const infotransaksi = await getInfoTransaksi(id_input);
        res.status(200).json({
          status: 0,
          message: "Transaksi berhasil",
          data: {
            invoice_number: inv_gen,
            service_code: data_service.service_code,
            service_name: data_service.service_name,
            transaction_type: "PAYMENT",
            total_amount: data_service.service_tariff,
            created_on:  infotransaksi.created_on
          }
        });
      } catch (error) {
        // Rollback transaksi jika ada error
        await new Promise((resolve, reject) => {
          connection.rollback((err) => {
            if (err) return reject(err);
            resolve();
          });
        });

        connection.release();
  
        res.status(500).json({ message: "Transaction failed", error: error.message });
      }
    }
    
  }
};

const getBalances = async (req,res) => {
  try {
    const email = req.user.email;
    var balance = await getBalanceUser(email);

    res.status(200).json ({
      status: 0,
      message: "Get Balance Berhasil",
      data: balance
    })
  }catch (error) {
    res.status(500).json({ error: error.message });
  }

}

const getHistoryTransaksi= async (req,res) => {
  try {
    const email = req.user.email;
    const data_user = await getInfoUser(email);
    const data_history = await getHistoryTransaksiModel(
      parseInt(req.query.limit),
      parseInt(req.query.offset),
      data_user.id
    )

    res.status(200).json ({
      status: 0,
      message: "Get Balance Berhasil",
      data: data_history
    })
  }catch (error) {
    res.status(500).json({ error: error.message });
  }

}

module.exports = {getBalances,userTopup,userTransaksi,getHistoryTransaksi};
