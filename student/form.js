const express = require('express');
const multer = require('multer');
const appi=express.Router();
let env=require('dotenv').config();
let jwt=require('jsonwebtoken');
const {ObjectId}=require('bson');
const SSLCommerzPayment = require('sslcommerz-lts');
let cloudinary=require('cloudinary').v2;
const {datastudent,datamess,datastudentseat, datamessnotice}=require("../Model/database");
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
  //ssl commmerch
  const store_id = process.env.store_id;
const store_passwd = process.env.store_passwd;
const is_live = false;
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
     v=await datamess.find({mess_location:location,mess_seat_price:{$gte:minimum,$lte:maximum},mess_seat_type:seat_type,available:true});
  }
  else{
  v=await datamess.find({available:true});
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


//ssl commerch
const tran_id=new ObjectId().toString();
appi.post('/paymentdone',verify,async (req,res)=>{
  let check=await datastudentseat.findOne({student_email:req.body.email});
  if(check){
   res.json({exist:true})
    
  }
  else{
    let tk=req.body.tk;
  const data = {
    total_amount: req.body.tk,
    currency: 'BDT',
    tran_id: tran_id, // use unique tran_id for each api call
    success_url: `http://localhost:3001/payment/success/${req.body._id}/${req.body.email}/${tran_id}`,
    fail_url: `http://localhost:3001/payment/fail/${req.body._id}/${req.body.email}/${"Not_paid"}`,
    cancel_url: `http://localhost:3001/payment/fail/${req.body._id}/${req.body.email}/${"Not_paid"}`,
    ipn_url: 'http://localhost:3030/ipn',
    shipping_method: 'Courier',
    product_name: 'Payment of seat booking',
    product_category: 'mess seat',
    product_profile: 'general',
    cus_name: 'Customer Name',
    cus_email: req.body.email,
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    cus_fax: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
};
const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
sslcz.init(data).then(apiResponse => {
    // Redirect the user to payment gateway
    let GatewayPageURL = apiResponse.GatewayPageURL
    res.json({url:GatewayPageURL,exist:false});
    console.log('Redirecting to: ', GatewayPageURL)
});
appi.post(`/payment/success/:_id/:email/:tran_id`,async (req,res)=>{
   let pp=await datastudent.findOne({email:req.params.email});
    let v=await datamess.findOneAndUpdate({_id:req.params._id,available:true},{$set:{available:false,student_booked:pp.name,student_email:pp.email,student_number:pp.phone,time:new Date()}});
    let p=await datamess.findOne({_id:req.params._id})
    await datastudent.findOneAndUpdate({email:req.params.email},{$set:{currentmess:p.mess_name}});
    let b=await datastudentseat.insertMany([{
      mess_id:req.params._id,
      student_email:req.params.email,
      tran_id:req.params.tran_id,
      Booking_date:new Date(),
      last_payment_date:new Date(),
      rent:tk
    }])
    res.redirect(`https://messbulbul.vercel.app/studentprofile/search/messconfirm/${req.params._id}/${req.params.email}/${req.params.tran_id}`);
})

appi.post('/payment/fail/:_id/:email/:tran_id',async (req,res)=>{

  res.redirect(`https://messbulbul.vercel.app/studentprofile/search/messconfirm/${req.params._id}/${req.params.email}/${req.params.tran_id}`);
})
//https://mess-management-backend.onrender.com
//https://messbulbul-git-master-sha-alam-bulbuls-projects.vercel.app
//https://messbulbul-git-master-sha-alam-bulbuls-projects.vercel.app/studentprofile/search/messconfirm/6679ce8106c1d32b34bbdab9/bulbulkhan420420@gmail.com/Not_paid
  } 
})


appi.post('/mess/status',verify,async (req,res)=>{
  let v=await datastudentseat.findOne({student_email:req.body.email});
  if(v){
    let p=await datamess.findOne({_id:v.mess_id});
    let a=v.last_payment_date;
    let b=new Date();
    let d=b-a;
    let ml=1000*60*60*24;
    d=d/ml;
    d=Math.floor(d);
    let info={
      tran_id:v.tran_id,
      rent:v.rent,
      mess_info:p,
      booking_date:v.Booking_date,
      current_date:new Date(),
      previous_payment_day:v.last_payment_date,
      payment_duration:d
    }
    res.json({
      verify:true,
      booked:true,
      info
    })
  }
  else{
  res.json({
    verify:true,
    booked:false
  })
  }
})

appi.post('/delete/studentmess',verify, async (req,res)=>{
  let {tran_id,_id}=req.body;
  await datamess.findOneAndUpdate({_id},{$set:{available:true,student_booked:'Not Booked',student_number:'Not Included',student_email:'Not Included'}});
  let v=await datastudentseat.findOneAndDelete({tran_id});
  if(v){
    res.json({
      verify:true,

    })
  }
})

appi.post('/student/noticeinfo',verify,async (req,res)=>{
  let {email}=req.body;
  let v=await datastudentseat.findOne({student_email:email});
  if(v){
    let _id=v.mess_id;
    let p=await datamess.findOne({_id});
    p=p.mess_email;
    let r=await datamessnotice.find({mess_email:p});
    r.reverse();
    if(r){
      res.status(200).json({
        verify:true,
        available:true,
        info:r
      })
    }
    else{
      res.json({
        verify:true,
        available:false
      })
    }
  }
  else{
    res.json({
      verify:true,
      available:false
    })
  }
})


appi.post('/month/payment',verify,async (req,res)=>{
  let {_id,rent,email}=req.body;
  let tran_id=new ObjectId().toString();



  const data = {
    total_amount: rent,
    currency: 'BDT',
    tran_id: tran_id, // use unique tran_id for each api call
    success_url: `http://localhost:3001/payment/success/rent/${_id}/${tran_id}`,
    fail_url: 'http://localhost:3001/payment/fail/rent',
    cancel_url: 'http://localhost:3001/payment/cancel/rent',
    ipn_url: 'http://localhost:3030/ipn',
    shipping_method: 'Courier',
    product_name: 'Payment of seat booking',
    product_category: 'mess seat',
    product_profile: 'general',
    cus_name: 'Customer Name',
    cus_email: 'bulbulkhan420420@gmail.com',
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    cus_fax: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
};
const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
sslcz.init(data).then(apiResponse => {
    // Redirect the user to payment gateway
    let GatewayPageURL = apiResponse.GatewayPageURL
    res.json({url:GatewayPageURL});
    
});

appi.post('/payment/success/rent/:_id/:tran_id',async (req,res)=>{
     let _id=req.params._id;
     let tran_id=req.params.tran_id;
     await datamess.findOneAndUpdate({_id:_id},{$set:{time:new Date()}})
     await datastudentseat.findOneAndUpdate({mess_id:_id},{$set:{tran_id,last_payment_date:new Date()}});
     res.redirect(`https://messbulbul.vercel.app/studentprofile/currentmess/${email}`)
})

appi.post('/payment/fail/rent',async (req,res)=>{
  res.redirect(`https://messbulbul.vercel.app/studentprofile/currentmess/${email}`)
})
appi.post('/payment/cancel/rent',async (req,res)=>{
  res.redirect(`https://messbulbul.vercel.app/studentprofile/currentmess/${email}`)
})
})
module.exports={appi};
