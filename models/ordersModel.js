

// const Sequelize = require ('sequelize');


// const sequelizedb  = require('../util/dbConnection');
// const orderModel =  sequelizedb.define('orders',{
//   id : { 
//     type : Sequelize.INTEGER, 
//     autoIncrement : true,
//     allowNull : false,
//     primaryKey : true,
//   },

//   paymentid : Sequelize.STRING,
//   orderid : Sequelize.STRING,
//   status : Sequelize.STRING
// })

// module.exports = orderModel;
// // 

const mongoose = require('mongoose')

const Schema = mongoose.Schema;


const orderModel = new Schema({
  
  paymentid : String,
  orderid : String,
  status : String,

  userid : [{
    type : Schema.Types.ObjectId, 
    ref:'userlogin'
  }]
})

module.exports = mongoose.model('order',orderModel)
