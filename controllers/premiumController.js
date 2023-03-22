const loginModel = require('../models/userLoginsModel')

const helperFunction = require('../services/functions')
const S3helper = require('../services/S3Services')

/**
 * HOME FOR PREMIUM ROUTES
 * GET LEADERBOARD
 * DOWNLOAD EXPENSES FILE
 * DOWNLOADS LIST
 */
exports.getLeaderBoard = async(req,res,next)=> {
    try{
      console.log("leaderboard entering")
      console.log(req.user.ispremium)
        if (req.user.ispremium == true){
         console.log("leaderboard entering")
            const leaderArray = await loginModel.find()
            .sort({totalExp : 'desc'})
            .then((result)=> { return result } )
            
            
            
            .catch(async(err)=> res.status(500).json({err, message: false}))
             console.log(leaderArray)
             
         res.status(200).json({leaderArray})
     }else{
         res.status(402).json("You are not a premium user")
     }
    }catch(err){console.log(err); console.log("error at store pass")}
   

    
}


exports.downloadExpenseFile = async (req, res, next) => {
   
   try{
      if (req.user.ispremium == true){
         
    const userID = req.user.id;
    const stringifiedExp = await helperFunction.getExpense(userID).then()


    const fileName = `Expense${userID}/${new Date()}.txt`;

    const fileurl = await S3helper.uploadToS3(stringifiedExp, fileName)
   //  console.log("file url is",fileurl)

    await  S3helper.urlExport(fileurl, userID).then(()=>{
      res.status(200).json({ fileurl, success: true })

    })

     
      } else{
         res.status(402).json("You are not a premium user")
      }
   } catch(err){
    console.log(err)
    console.log("error at download ")
    res.status(500).json({fileurl:'', success : false, err : err})
   }


}

exports.downloadsList  = async (req, res, next)=>{
 
  try{
   if (req.user.ispremium== true){
    const list = await S3helper.urlsFetch(req.user.id);
    console.log(list)
res.status(200).json({list})
} else{
   res.status(402).json("You are not a premium user")
}

   }catch(err){
      console.log("error at download list")
    console.log(err)
   }
   
}





