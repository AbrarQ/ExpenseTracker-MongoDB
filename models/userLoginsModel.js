

// const Sequelize = require ('sequelize');

// const sequelizedb  = require ('../util/dbConnection');

// const usersModel =   sequelizedb.define  ('userlogins',{
//   id : { 
//     type : Sequelize.INTEGER, 
//     autoIncrement : true,
//     allowNull : false,
//     primaryKey : true,
//   },

//   name : { 
//     type : Sequelize.STRING, 
//     allowNull : false,
 
//   },

//   email : { 
//     type : Sequelize.INTEGER,
//     allowNull : false, 
    
//   },
//   phonenumber : { 
//     type : Sequelize.INTEGER,
//     allowNull : false, 
    
//   },
//   password : { 
//     type : Sequelize.STRING,
//     allowNull : false, 
    
//   },
//   ispremium : { 
//     type : Sequelize.STRING,
//     allowNull : true, 
    
//   },
//   totalexp : Sequelize.INTEGER
  
// })


// module.exports = usersModel;

const mongoose = require('mongoose')

const Schema = mongoose.Schema;


const userLoginsModel = new Schema({

  name : String,
  email : String,
  phonenumber : Number,
  password : String,
  ispremium : Number,
  totalExp: Number

})


module.exports = mongoose.model('userlogin',userLoginsModel)

