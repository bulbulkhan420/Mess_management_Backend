let express=require('express');
let updatepass=express.Router();
let bcrypt=require('bcryptjs');
let {datastudent}=require('../Model/database.js');
updatepass.patch("/updatepass", async (req,res)=>{
    let {email,password}=req.body;
    password=await bcrypt.hash(password, 10);
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