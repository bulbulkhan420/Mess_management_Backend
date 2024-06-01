let express=require('express');
let otppasschange=express.Router();

let {datastudent}=require('../Model/database.js');
otppasschange.post("/otppasswordchange",async (req,res)=>{
    let {email,otp}=req.body;
    let v=await datastudent.findOne({email:email,otp:otp});
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
});
module.exports={otppasschange};