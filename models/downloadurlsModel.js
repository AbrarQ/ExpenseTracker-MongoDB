

// const Sequelize = require ('sequelize');


// const sequelizedb  = require('../util/dbConnection');


// const linksModel =  sequelizedb.define('urls',{
//   userid : { 
//     type : Sequelize.INTEGER, 
//     allowNull : false,
//     primaryKey : true,
//   },

//   url : { 
//     type : Sequelize.STRING,
//     allowNull : false,    
//   },
  
// })

// module.exports = linksModel;


const mongoose = require('mongoose')

const Schema = mongoose.Schema

const linksModel = new Schema({
  url : String,

  userid : [{
    type : Schema.Types.ObjectId, 
    ref:'userlogin'
  }]

})

module.exports = mongoose.model('url',linksModel)

