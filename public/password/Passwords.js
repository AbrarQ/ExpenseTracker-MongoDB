/**
 * Functions:( Passwords resetting)
 * submitPass - submits new pass  
 * resetPass - makes a request to change the password
 */ 


   //    const abc = require('axios');

   // const axios = abc.create({
   //    baseURL: 'http://localhost:4000'
   //  });

// document.getElementById("reset").onclick =  async function(e){
//    try {

//       const newpass = document.getElementById("pass").value;
//       console.log(newpass)



//       const path = window.location.pathname;
//       const fileName = path.split('/').pop();
//       console.log(fileName)

//       const passObj = { newpass, fileName }
//       console.log(passObj)



//       await axios.get('http://localhost:4000/password/updatepassword', passObj)

//          .then(response => {
//             document.getElementById("result").innerHTML = response.data.message;
//             document.getElementById("pass").value;
//          })
//          .catch(err => document.getElementById("result").innerHTML = err.message)


//    } catch (err) { console.log(err) }

// // }




async function resetPass(event) {
   event.preventDefault();

   const emailid = document.getElementById("eid").value;

   const resetObj = { emailid }

   await axios.post('http://localhost:4000/password/forgotpassword', resetObj)
       .then((response) => {
           // setNewPass(response.data.uuid)
           document.getElementById("result").innerHTML = response.data.message;
           return response.data
       })
       .catch(err => document.getElementById("result").innerHTML = err.message)
   document.getElementById("eid").value = "";
};
