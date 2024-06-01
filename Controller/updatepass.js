let express=require('express');
let updatepass=express.Router();

let {datastudent}=require('../Model/database.js');
updatepass.patch("/updatepass", async (req,res)=>{
    let {email,password}=req.body;
    let v=await datastudent.updateOne({email:email},{$set:{password:password}});
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
module.exports={updatepass};