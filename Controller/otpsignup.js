let express=require('express');
let otpsignup=express.Router();

let {datastudent}=require('../Model/database.js');
otpsignup.post("/otpverify", async (req,res)=>{
    let {email,otp}=req.body;
    let v=await datastudent.findOne({email:email,otp:otp});
    if(v){
        await datastudent.updateOne({email:email},{$set:{verify:true}});
        res.json({
            check:true
        });
    }
    else{
        res.json({
            check:false
        });
    }
});
module.exports={otpsignup};