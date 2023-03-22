const usersModel = require('./userLoginsModel')

module.exports = async function (email){

    const allData = await usersModel.find({ email: email })
    .then(response => response)
    .catch(async(err)=> res.status(500).json({err}))
    
    try {
      
        console.log(allData.length)
        
        if(allData.length>0){
            console.log("Already exists")
            console.log(allData.email)
    
            return -1;
    

        } else{
        console.log("no such user found ")
    
        return 0;
        }
        

    } catch(err){
        console.log(err)
    }
   
    

};





