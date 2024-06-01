const express = require('express');
const multer = require('multer');
const appi=express.Router();
const {datastudent}=require("../Model/database");
// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'pictures/') // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`); // Keeping the original filename
  }
});

const upload = multer({ storage: storage });
appi.use(express.static('pictures'));
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
appi.post("/studentprofile",async (req,res)=>{
   let email=req.body.email;
   let v=await datastudent.findOne({email:email});
   if(v){
    res.json(v);
   }
  
})

module.exports={appi};
