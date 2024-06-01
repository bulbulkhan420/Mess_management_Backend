const express = require('express');
const multer = require('multer');
const ownerapp=express.Router();
const {dataowner}=require("../Model/database");
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
ownerapp.use(express.static('pictures'));
// Route for handling file uploa
ownerapp.post('/uploadpicowner', upload.single('bul'),async (req, res) => {
 let file=req.file;
 let email=req.body.email;
 let b=await dataowner.updateOne({email:email},{image:file.filename});
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
ownerapp.post("/ownerprofile",async (req,res)=>{
   let email=req.body.email;
   let v=await dataowner.findOne({email:email});
   if(v){
    res.json(v);
   }
  
})

module.exports={ownerapp};
