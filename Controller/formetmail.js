let express=require('express');
let forgetmail=express.Router();
let nodemailer=require('nodemailer');
let sendemail= async (code,email)=>{
   let tran=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"deathturn420@gmail.com",
            pass:"ifluxbmzhyazmndb" 
        }
    })
    try{
      await tran.sendMail({
        from:"deathturn420@gmail.com",
        to:email,
        subject:"Verification Mail",
        text:`Your otp is ${code}`
      });
    }
    catch(err){
        console.log("error");
    }
}
let {datastudent}=require('../Model/database.js');
forgetmail.post("/forgetmail", async (req,res)=>{
    let email=req.body.email;
    let v=await datastudent.findOne({email});
    if(v){
       let b=Math.floor(Math.random()*999999)+100000;
       await datastudent.updateOne({email},{$set:{otp:b}});
       await sendemail(b,email);
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
module.exports={forgetmail};