

// const Sequelize = require ('sequelize');


// const sequelizedb  = require('../util/dbConnection');

// const forgotModel =  sequelizedb.define('forgotpasses',{
//   uuid : { 
//     type : Sequelize.INTEGER, 
//     autoIncrement : true,
//     allowNull : false,
//     primaryKey : true,
//   },

//   userloginId : { 
//     type : Sequelize.INTEGER, 
//     allowNull : false,
 
//   },

//   isactive : { 
//     type : Sequelize.INTEGER,
//     allowNull : false, 
    
//   },
  
// })


// module.exports =  forgotModel;


const mongoose = require('mongoose')

const Schema = mongoose.Schema

const forgotModel = new Schema({
  uuid : String,
  isactive : Number,
  userid : [{
    type : Schema.Types.ObjectId, 
    ref:'userlogin'
  }]
})

module.exports = mongoose.model('forgotpasse',forgotModel)