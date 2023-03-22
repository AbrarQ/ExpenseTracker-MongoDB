const usersModel = require('../models/userLoginsModel')
const helperFunction = require('../services/functions')
const path = require('path')
const linkModel = require('../models/resetPassLinkStatusModel')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

/**
 * HOME FOR PASSWORD ROUTES
 * RESET PASSWORD
 * SEND HTML ,SEND JS
 * STORE UPDATED PASSWORD IN DATABASE
 */





exports.passwordEmailer = async (req, res, next) => {
    try{
        const mail = req.body.emailid;
    const uuidx = req.middlewareUUID;
   console.log("Entering email sender")
   

    const Sib = require('sib-api-v3-sdk');

    const client =  Sib.ApiClient.instance;

    const apiKey =  client.authentications['api-key'];
    apiKey.apiKey = process.env.SIB_API_KEY;

    // create a transactional email message
    let sendSmtpEmail = new Sib.SendSmtpEmail();
    sendSmtpEmail.to = [{ "email": mail }];
    sendSmtpEmail.sender = { "email": "abrarquraishi96@gmail.com", "name": "Abrar" };
    sendSmtpEmail.subject = "Reset-Password";
    sendSmtpEmail.textContent = "Hey Click below to reset Your Password";
    sendSmtpEmail.htmlContent = `<form  onsubmit="submitPass(event)" ><a href="http://localhost:4000/password/resetpassword/${uuidx}">Reset Password</a></form>`;
    console.log(sendSmtpEmail.htmlContent)

    // send the email
    const apiInstance = new Sib.TransactionalEmailsApi();
    apiInstance.sendTransacEmail(sendSmtpEmail)
        .then(
            res.json({ message: "Email sent successfully.", uuid :uuidx })
        )
        
    }catch(err){
      res.status(500).json({ error: err, message: false })
      console.log(err); console.log("error at reset pass")}
    



}


exports.sendhtml = async (req, res, next)=> {
  // console.log("sending html file")
  //   await res.sendFile(path.join(__dirname, '../public/password/SetNewPass.html'))

  //   //  next();
  const uuid =  req.params.uuid;
  console.log("uudi is sending to link sendhtml",uuid)
  res.status(200).send(`<html>
  
  <form>
      <label for="newpassword">Enter New password</label>
      <input id ="pass" name="newpassword" type="password" required></input>
      <button id ="reset">reset password</button>
      <p id="result"></p>
  </form>
  <form action="../../signIN/signin.html">
  <button>Existing User - Sign in </button>
</form>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js" integrity="sha512-bZS47S7sPOxkjU/4Bt0zrhEtWx0y0CRkhEp8IckzK+ltifIIE9EMIMTuT/mEzoIMewUINruDBIR/jJnbguonqQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script>
   
document.getElementById("reset").onclick =  async function(e){
  try {
      e.preventDefault();
     const newpass = document.getElementById("pass").value;
     console.log(newpass)



     const path = window.location.pathname;
     const fileName = path.split('/').pop();
     console.log(fileName)

     const passObj = { newpass, fileName }
     console.log(passObj)



     await axios.post('http://localhost:4000/password/updatepassword', passObj)

        .then(response => {
           document.getElementById("result").innerHTML = response.data.message;
           document.getElementById("pass").value;
        })
        .catch(err =>{ console.log(err);
          document.getElementById("result").innerHTML = err.message})


  } catch (err) { console.log(err) }

}


  </script>
</html>`
)
res.end()
}


// exports.sendjs= async (req, res) => {
//   try{
//     console.log("sending JS file")
//    await res.set('Content-Type', 'application/javascript');
//   res.sendFile(path.join(__dirname,'../public/password/Passwords.js'))
//   }catch(e){console.log("send js error",e)}
  
// };
 
    

  
// exports.sendjs = async (req, res) => {
//   console.log("hi")
//   res.set('Content-Type', 'application/x-javascript');
//   res.sendFile(path.join(__dirname, '../public/password/Passwords.js'))
// };
  
  
  
  
 
  
  
  exports.storepass = async (req, res, next) => {
    console.log("Entering store pass", req.body)

    
  

    const userID = await helperFunction.userID(req.body.fileName)
    console.log(userID.userid[0])
    if(userID.isactive ===0){
      console.log("cant use me")
      res.status(401).json({err : "Url Expired!!!", success: false});
    }  else {
  
    const pass = await req.body.newpass
  console.log(pass)
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(pass, salt)
  
  
    const session = await mongoose.startSession()
    session.startTransaction()

    try{
      
      
      const filterby = { _id: new mongoose.Types.ObjectId(userID.userid[0]) }
      
      const updatePass = { password : hashedPass}

      console.log(filterby, updatePass)

      await usersModel.findOneAndUpdate(filterby,updatePass,
        {session}
        )
        // .session(session)
        .then(async(updation)=>{
        console.log(updation)
          const filterby = { userid : userID }
          const updatestatus = { isactive: false }
          await linkModel.findOneAndUpdate(filterby,updatestatus,
            {session}
            )
            // .session(session)
          .then(async () => {
          await session.commitTransaction();
          
          res.status(200).json(updation)
        })
      })
      } catch (err) {
        await session.abortTransaction()
      } finally {
          session.endSession()
       }
   }
  }
  