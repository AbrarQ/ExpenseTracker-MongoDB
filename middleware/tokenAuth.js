const jwt = require('jsonwebtoken');
const usersModel = require('../models/userLoginsModel')

const mongoose = require('mongoose')

/**
 * HOME FOR MIDDLEWARES
 *  TOKEN AUTHENTICATION
 * USER PREMIUM VERIFICATION
 */
exports.authenticate =  (req,res, next) =>{
   try{
    const token = req.header("Authorization");
    console.log(token);
    console.log("entering authenticaation middleware")

    const userToken =  jwt.verify(token, process.env.JWT_SECRET_KEY );
    console.log(userToken)

    // console.log(user," token wala user")
    usersModel.findById(userToken.userId).then( data => {
        // console.log(JSON.stringify(data))
        if(data!=null){
            
            req.user= data
            console.log(req.user,"is data wala")
            next();
        }
    
        // console.log(req.user.totalexp)
      
        
    }).catch((err => console.log(err)))
   } catch(err){
    console.log(err);
    res.status(401).json({success : false})
   }
}


exports.verification =  (req,res, next) =>{
    try{
     const token = req.header("Authorization");
     // console.log(token);
     console.log("entering verification")
     console.log(token)
 
     const userToken =  jwt.verify(token, process.env.JWT_SECRET_KEY );
     console.log(userToken)
 
     // console.log(user," token wala user")
     usersModel.findById(userToken.userId).then( data => {
         console.log(data.ispremium)
         if(data.ispremium === 1){
             
        console.log("he is premium")
             res.status(200).json(data)
             // console.log(req.user,"is data wala"
             
         }
     
         // console.log(req.user.totalexp)
       
         
     }).catch((err => console.log(err)))
    } catch(err){
     console.log(err);
     res.status(401).json({success : false})
    }
 }
 