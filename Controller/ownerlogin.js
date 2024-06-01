let express=require('express');
let ownerlogin=express.Router();

let {dataowner}=require('../Model/database.js');
ownerlogin.post("/loginmess", async (req,res)=>{
    let {email,password}=req.body;
    let result=await dataowner.findOne({email:email,password:password,verify:true});
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
module.exports={ownerlogin};