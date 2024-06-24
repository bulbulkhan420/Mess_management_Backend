const express = require('express');
const multer = require('multer');
let env=require('dotenv').config();
let jwt=require('jsonwebtoken');

const ownerapp=express.Router();

let cloudinary=require('cloudinary').v2;
const {dataowner,datamess}=require("../Model/database");
//ssl commerch

// Multer storage configuration
const upload = multer({ dest: 'pictures/' });
cloudinary.config({ 
    cloud_name: 'dfhug7rwx', 
   api_key: '262784511165531', 
     api_secret: 'T_JoL4AMHQeaMQYy2_GFW8S0uco' 
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
// Route for handling file uploa
ownerapp.post("/ownerprofile",async (req,res)=>{
   let email=req.body.email;
   let v=await dataowner.findOne({email:email});
   if(v){
    res.json(v);
   }
  
})
// 
ownerapp.post('/addnewroom',upload.single('mess_seat_image'),verify,async (req,res)=>{
  let info=req.body;
  let file=req.file;
  let url;
  await cloudinary.uploader.upload(file.path,{resource_type:'image'},
      function(err,result){
          url=result.secure_url;
      });
  let v= await datamess.insertMany([{
    mess_location:info.mess_location,
    mess_name:info.mess_name,
    mess_owner:info.mess_owner,
    mess_email:info.mess_email,
    mess_map:info.mess_map,
    mess_room_description:info.mess_room_description,
    mess_room_number:info.mess_room_number,
    mess_seat_image:url,
    student_booked:"Not Booked",
    student_email:"Not Included",
    student_number:"Not Included",
    available:true,
    mess_seat_price:info.mess_seat_price,
    mess_owner_phone:info.mess_owner_phone,
    mess_seat_type:info.mess_seat_type
  }]);
  if(v){
    res.json({
      verify:true,
      
    })
  }
 
})
ownerapp.post('/availableseat',verify,async (req,res)=>{
    let v=await datamess.find({mess_email:req.body.mess_email,available:true});
   
    if(v){
      res.json({
        verify:true,
        info:v,
       
      })
    }
})
ownerapp.delete(`/deletroomlist/:_id`,async (req,res)=>{
  let v=await datamess.findOneAndDelete({_id:req.params._id});
  if(v){
    res.json({
      ok:true
    })
  }
})
ownerapp.post('/addmap',verify,async (req,res)=>{
  let {email,mess_map}=req.body;
  await datamess.updateMany({mess_email:email},{$set:{mess_map}});
  let v=await dataowner.findOneAndUpdate({email},{$set:{mess_map:mess_map}});
 
  if(v){
    res.status(200).json({
      verify:true,

    })
  }
})
ownerapp.post('/unavailablelist',verify,async (req,res)=>{
 let v=await datamess.find({mess_email:req.body.mess_email,available:false});
 
 if(v){
  res.status(200).json({
    verify:true,
    info:v,
    
  })
 }
})
ownerapp.post('/seatstatus',verify,async (req,res)=>{
  let av=await datamess.countDocuments({mess_email:req.body.mess_email,available:true});
  let bo=await datamess.countDocuments({mess_email:req.body.mess_email,available:false})
  res.json({
    verify:true,
    av,
    bo
  })
})


module.exports={ownerapp};
