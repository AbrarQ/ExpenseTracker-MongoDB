const usersModel = require('../models/userLoginsModel');
const passModel = require('../models/resetPassLinkStatusModel')
const expModel = require('../models/expensesModel')
const mongoose = require('mongoose')






const userID = async function fetchUserID(uuid) {
    console.log("Fetching user Id, step-2")
    const UUID = `${uuid}`;

    const allData = await passModel.findOne({ uuid: UUID } )
        .catch(async (err) => res.status(500).json({ err }))
    const check = JSON.stringify(allData);
    const final = JSON.parse(check)
    // if(final == null){
    //     return final
    // } else {
       
    return final;
    // }

}

exports.userID = userID;


const getExpense = async function(userid){

    try{
        const exp = await expModel.find( {_id : new mongoose.Types.ObjectId(userid)} )
    
        return JSON.stringify(exp);
    } catch (e){
        console.log(e)
        console.log("get exp.1")
    }
   

}

exports.getExpense = getExpense;


