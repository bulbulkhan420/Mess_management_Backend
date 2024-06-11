const express = require('express');
const multer = require('multer');
const appi=express.Router();
let env=require('dotenv').config();
let jwt=require('jsonwebtoken');
let cloudinary=require('cloudinary').v2;
const {datastudent,datamess}=require("../Model/database");
// Multer storage configuration

const upload = multer({ dest: 'pictures/' });
cloudinary.config({ 
    cloud_name: 'dfhug7rwx', 
   api_key: '262784511165531', 
     api_secret: 'T_JoL4AMHQeaMQYy2_GFW8S0uco' 
 });
  // route.post("/upload",upload.single('file'),async (req,res)=>{
  //     let file=req.file;
  //     await cloudinary.uploader.upload(file.path,{resource_type:'raw'},
  //   function(error, result) {
  //     console.log(result); 
  //     res.json({url:result.secure_url});
  // });
// Route for handling file uploa
appi.post('/uploadpic', upload.single('bul'),async (req, res) => {
 let file=req.file;
 let email=req.body.email;
 let b=await datastudent.updateOne({email:email},{image:file.filename});
 console.log(file);
 if(b){
  res.json({
    ok:true
  })
 }
 else{
  res.json({
    ok:false
  })
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
appi.post("/studentprofile",async (req,res)=>{
   let email=req.body.email;
   let v=await datastudent.findOne({email:email});
   if(v){
    res.json(v);
   }
  
})
appi.post("/info/studentupdate",verify,async (req,res)=>{
  let info=req.user;
  let v=await datastudent.findOne({email:info.email,verify:true});
  res.json({
    verify:true,
    info:v
  })
})
appi.post("/student/picupload",upload.single('image'),async (req,res)=>{
  let file=req.file;
  let email=req.body.email;
  let v=await datastudent.findOne({email,verify:true});
  if(v){
    let url;
    await cloudinary.uploader.upload(file.path,{resource_type:'image'},
      function(err,result){
          url=result.secure_url;
      });
      let y=await datastudent.findOneAndUpdate({email,verify:true},{$set:{image:url}});
      if(y){
        res.json({
          status:"Successfully Uploaded"
        })
      }
  }
    
})
appi.post("/student/updateinfo",verify,async (req,res)=>{
  let info=req.body;
  
  let v=await datastudent.findOneAndUpdate({email:info.email,verify:true},{$set:{name:info.name,phone:info.phone,currentaddress:info.currentaddress,permanentaddress:info.permanentaddress,institution:info.institution}});
  if(v){
    res.json({
      ok:true,
      verify:true
    })
  }
  else{
    res.json({
      ok:false,
      verify:true
    })
  }
})
appi.post('/mess/seatinfo',verify,async (req,res)=>{
  let {location,minimum,maximum,seat_type}=req.body;
  let v;
  if(location.length>0&&seat_type.length>0){
     v=await datamess.find({mess_location:location,mess_seat_price:{$gte:minimum,$lte:maximum},mess_seat_type:seat_type});
  }
  else{
  v=await datamess.find();
  }
  if(v){
    res.json({
      verify:true,
      ok:true,
      info:v
    })
  }
  else{
    res.json({
      verify:true,
      ok:false
    })
  }
})
appi.post('/student/payment',verify,async (req,res)=>{
  let v=await datamess.findOne({_id:req.body.id});
  res.json({
    verify:true,
    info:v
  })
})
module.exports={appi};
