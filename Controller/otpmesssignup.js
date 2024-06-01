let express=require("express");
let otpmesssignup=express.Router();
let {dataowner}=require("../Model/database");
otpmesssignup.post("/otpmessverify", async (req,res)=>{
    let {email,otp}=req.body;
    let v=await dataowner.findOne({email:email,otp:otp});
    if(v){
        await dataowner.updateOne({email:email},{$set:{verify:true}});
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
module.exports={otpmesssignup};