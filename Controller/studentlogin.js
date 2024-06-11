let express=require('express');
let studentlogin=express.Router();
let env=require('dotenv').config();
let bcrypt=require('bcryptjs');
let jwt=require('jsonwebtoken');
let {datastudent}=require('../Model/database.js');
studentlogin.post("/login",async (req,res)=>{
    let {email,password}=req.body;
    
    let result=await datastudent.findOne({email:email,verify:true});
    if(result){
        
       bcrypt.compare(password,result.password,function(err,tt){
        if(tt){
            let token=jwt.sign({name:result.fname+" "+result.lname,email:result.email,phone:result.phone,image:result.image,currentaddress:result.currentaddress,permanentaddress:result.permanentaddress,institution:result.institution,currentmess:result.currentmess},process.env.JWT_KEY,{expiresIn:'100d'});

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
       });
     
       
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
 
studentlogin.post('/verify/student',verify,async (req,res)=>{
  let info=req.user;
  let v=await datastudent.findOne({email:info.email,verify:true});
  res.json({
    verify:true,
   info:v
  })
})
module.exports={studentlogin};