let express=require('express');
let ownersignup=express.Router();
let nodemailer=require('nodemailer');
let sendmail= async (code,email)=>{
    let tran=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"deathturn420@gmail.com",
            pass:"ifluxbmzhyazmndb"
        }
    });
    try{
        await tran.sendMail({
            from:"deathturn420@gmail.com",
            to:email,
            subject:"Verify your Email",
            text:`Your verification password id ${code}`
           });
    }
    catch(err){
        console.log("error");
    }
   
   
}
let {dataowner}=require("../Model/database");
ownersignup.post("/ownersignup",async (req,res)=>{
    let {location,fname,lname,email,phone,password}=req.body;
    let image="avatar.png";
    let v=await dataowner.findOne({email:email});
    if(v){
        if(v.verify){
            res.json({
                check:true
            });
        }
        else{
            await dataowner.deleteOne({email:email});
            let b=Math.floor(Math.random()*900000)+100000;
            await dataowner.insertMany([{location,fname,lname,image,email,phone,password,verify:false,otp:b}]);
            await sendmail(b,email);
            res.json({
                check:false
            });
        }
       
    }
    else{
        let b=Math.floor(Math.random()*900000)+100000;
        await dataowner.insertMany([{location,fname,lname,image,email,phone,password,verify:false,otp:b}]);
        await sendmail(b,email);
        res.json({
            check:false
        });
    }
});
module.exports={ownersignup};