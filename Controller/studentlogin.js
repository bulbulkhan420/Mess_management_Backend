let express=require('express');
let studentlogin=express.Router();

let {datastudent}=require('../Model/database.js');
studentlogin.post("/login",async (req,res)=>{
    let {email,password}=req.body;
    
    let result=await datastudent.findOne({email:email,password:password,verify:true});
    if(result){
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
module.exports={studentlogin};