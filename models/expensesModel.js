

// const Sequelize = require ('sequelize');


// const sequelizedb  = require('../util/dbConnection');

// const expmodel =  sequelizedb.define('expenses',{
//   id : { 
//     type : Sequelize.INTEGER, 
//     autoIncrement : true,
//     allowNull : false,
//     primaryKey : true,
//   },

//   amount : { 
//     type : Sequelize.STRING, 
//     allowNull : false,
 
//   },

  
//   description : { 
//     type : Sequelize.STRING,
    
//     allowNull : false, 
    
//   },
//   category : { 
//     type : Sequelize.STRING,
//     allowNull : false, 
    
//   },
//   userloginId :
//   {
//     type : Sequelize.INTEGER
//   }
// })

// module.exports = expmodel;

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const expmodel = new Schema({

  amount : Number,
  description : String,
  category : String,
  userid : [{
    type : Schema.Types.ObjectId, ref:'userlogin'
  }]


})


module.exports = mongoose.model('expense',expmodel)

