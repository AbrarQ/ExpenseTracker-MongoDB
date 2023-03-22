
const usersModel = require('../models/userLoginsModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')




function generateAuthToken(id){
    return  jwt.sign({userId : id}, process.env.JWT_SECRET_KEY)
}

function generateAuthToken(id,key){
    return  jwt.sign({userId : id, ispremium:key}, process.env.JWT_SECRET_KEY)
}
/**
 * HOME FOR SIGNIN ROUTES
 * GET USERS WITH WHERE CONDITION
 */
exports.getUsers = async (req, res, next) => {

    console.log("entering login")


    try {

        const emailData = req.body.emaildata;
        console.log(emailData)
        
        
    
    
            const allData = await usersModel.find({ email: emailData }).then(response => response)
             .catch(async(err)=> res.status(500).json({err}))
           
            console.log(allData)
    
            if (allData.length==0){
                res.status(404).send();
            
            } else{
            const hashPass = allData[0].password
            
            const pass = req.body.passwrd;
            

            const comparePass = await  bcrypt.compare(pass,hashPass);
    
            
    
            if (comparePass == false) {
                
               res.status(401).json({message: "Incorrect Password"})
            } else if (comparePass == true) {

               
                if (allData[0].ispremium===1){
                    
    
                    res.status(200).json({token :  generateAuthToken(allData[0]._id, "True"),message : "Login done as Premium User"})
            } else {
                
                res.status(200).json({token :  generateAuthToken(allData[0]._id, "False"),message : "Login done"})
            }
                }}
    } catch(err){
console.log(err);
console.log("error at sigin ctrl")
    }
    }
    





// exports.resetPass = async( req, res, next)=> {
//     const mail  = req.body.emailid;
    
//  const Sib = require('sib-api-v3-sdk');

//  const client = Sib.ApiClient.instance;

//  const apiKey = client.authentications['api-key'];
// apiKey.apiKey = process.env.API_KEY;

// // create a transactional email message
// let sendSmtpEmail = new Sib.SendSmtpEmail();
// sendSmtpEmail.to = [{ "email": mail}];
// sendSmtpEmail.sender = { "email": "abrarquraishi96@gmail.com", "name": "Abrar" };
// sendSmtpEmail.subject = "Reset-Password";
// sendSmtpEmail.textContent = "Hey Click here to reset Your Password";
// sendSmtpEmail.htmlContent = "<a href='https://www.google.com/'>Google.com</a>";

// // send the emai
// const apiInstance = new Sib.TransactionalEmailsApi();
// apiInstance.sendTransacEmail(sendSmtpEmail)
//   .then(
//    res.status(200).json({message : "Email sent successfully."})
//   )
//   .catch((err)=> {
//     res.status(500).json({error : err, message : false})
// });



// }


