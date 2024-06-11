let express=require('express');
let studentsignup=express.Router();
let nodemailer=require('nodemailer');
const bcrypt = require('bcryptjs');
let sendmail= async (code,email)=>{
    let tran=nodemailer.createTransport({
        service:"gmail",
        host: "smtp.gmail.email",
        port: 587,
        secure: false,
        auth:{
            user:"deathturn420@gmail.com",
            pass:"ifluxbmzhyazmndb"
        }
    });
    try{
        await tran.sendMail({
            from:{
                name:"Mess Management",
                address:"deathturn420@gmail.com"
            },
            to:email,
            subject:"Verification Code To Verify Your Id",
            text:`Your verification code is ${code}`
           });
    }
    catch(err){
        console.log("error");
    }
   
   
}
let {datastudent}=require("../Model/database");
studentsignup.post("/studentsignup",async (req,res)=>{
    let {fname,lname,email,phone,password}=req.body;
    password=await bcrypt.hash(password, 10);
    let image="https://res.cloudinary.com/dfhug7rwx/image/upload/v1717610831/avatar_j76eeo.png";
    let v=await datastudent.findOne({email:email});
    if(v){
        if(v.verify){
            res.json({
                check:true
            });
        }
        else{
            await datastudent.deleteOne({email:email});
            let b=Math.floor(Math.random()*900000)+100000;
            await datastudent.insertMany([{fname,lname,name:fname+" "+lname,image,email,phone,password,currentaddress:"Not included",permanentaddress:"Not included",institution:"Not included",currentmess:"Not included",verify:false,otp:b}]);
            await sendmail(b,email);
            res.json({
                check:false
            });
        }
       
    }
    else{
        let b=Math.floor(Math.random()*900000)+100000;
        await datastudent.insertMany([{fname,lname,name:fname+" "+lname,image,email,phone,password,currentaddress:"Not included",permanentaddress:"Not included",institution:"Not included",currentmess:"Not included",verify:false,otp:b}]);
        await sendmail(b,email);
        res.json({
            check:false
        });
    }
});
module.exports={studentsignup};