// const expModel = require('../models/expenseDefine')
// const linkmodel  = require('../models/Linksmodel');






async function paginate10(offset, limit){

    try{
        
    const list = await expModel.findAll({
 
        offset : offset,
        limit : lim
   })
    
    return list;
    
    } catch(e){
     console.log(e)
     console.log("pagin")
    }
 
    
 }
 
  
  module.exports= {
    paginate10
    
  }