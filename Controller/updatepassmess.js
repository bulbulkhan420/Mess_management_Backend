let express=require('express');
let updatepassmess=express.Router();

let {dataowner}=require('../Model/database.js');
updatepassmess.patch("/updatepassmess", async (req,res)=>{
    let {email,password}=req.body;
    let v=await dataowner.updateOne({email:email},{$set:{password:password}});
    if(v){
        res.json({
            check:true
        })
    }
    else{
        res.json({
            check:false
        })  
    }
})
module.exports={updatepassmess};