let express=require('express');
let ownerlogin=express.Router();
let env=require('dotenv').config();
let bcrypt=require('bcryptjs');
let jwt =require('jsonwebtoken');
let {dataowner}=require('../Model/database.js');
ownerlogin.post("/loginmess", async (req,res)=>{
    let {email,password}=req.body;
    let result=await dataowner.findOne({email:email,verify:true});
    if(result){
        bcrypt.compare(password,result.password,function(err,tt){
            if(tt){
                let token= jwt.sign({name:result.fname+" "+result.lname,email:result.email,phone:result.phone,location:result.location},process.env.JWT_KEY,{expiresIn:'100d'});
                res.json({
                    check:true,
                    token
                });
            }
            else{
                res.json({
                    check:false
                });
            }
        
    })
}
    else{
        res.json({
            check:false
        });
    }
});
let verify=(req,res,next)=>{
    let authorization=req.body.authorization;
    if(authorization==null){
       return res.json({
           verify:false
       })
    }
       let token=authorization;
       let check=jwt.verify(token,process.env.JWT_KEY);
       if(check){
          req.user=check;
          next();
       }
       else{
          res.json({
              verify:false
          })
       }
    }
    
ownerlogin.post("/verify/owner",verify,(req,res)=>{
    let info=req.user;
    res.json({
        verify:true,
        info
    })
})
module.exports={ownerlogin};