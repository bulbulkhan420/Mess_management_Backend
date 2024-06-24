let express=require('express');
let ownersignup=express.Router();
let nodemailer=require('nodemailer');
let bcrypt=require('bcryptjs');
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
            from:{
            name:"Mess Management",
            address:"deathturn420@gmail.com"
            },
           
            to:email,
            subject:"Verification Code To Verify Your Id",
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
    let {location,fname,lname,email,phone,password,messname}=req.body;
    password=await bcrypt.hash(password,10);
    let image="https://res.cloudinary.com/dfhug7rwx/image/upload/v1717610831/avatar_j76eeo.png";
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
            let mess_map=`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116289.45112401828!2d88.52375719423021!3d24.37972583602227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fbefa96a38d031%3A0x10f93a950ed6f410!2sRajshahi!5e0!3m2!1sen!2sbd!4v1718985563604!5m2!1sen!2sbd" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
            await dataowner.insertMany([{location,fname,mess_map,lname,image,messname,email,phone,password,verify:false,otp:b}]);
            await sendmail(b,email);
            res.json({
                check:false
            });
        }
       
    }
    else{
        let b=Math.floor(Math.random()*900000)+100000;
        let mess_map=`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116289.45112401828!2d88.52375719423021!3d24.37972583602227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fbefa96a38d031%3A0x10f93a950ed6f410!2sRajshahi!5e0!3m2!1sen!2sbd!4v1718985563604!5m2!1sen!2sbd" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
        await dataowner.insertMany([{location,fname,messname,mess_map,lname,image,email,phone,password,verify:false,otp:b}]);
        await sendmail(b,email);
        res.json({
            check:false
        });
    }
});
module.exports={ownersignup};