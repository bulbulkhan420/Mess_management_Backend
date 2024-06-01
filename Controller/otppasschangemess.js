let express=require('express');
let otppasschangemess=express.Router();

let {dataowner}=require('../Model/database.js');
otppasschangemess.post("/otppasswordchangemess",async (req,res)=>{
    let {email,otp}=req.body;
    let v=await dataowner.findOne({email:email,otp:otp});
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
module.exports={otppasschangemess};