const mongoose=require('mongoose');
const env=require('dotenv').config();
let url=process.env.DATABASEL_URL;
mongoose.connect(url);
let Schema=new mongoose.Schema({
    fname:String,
    lname:String,
    image:String,
    email:String,
    phone:String,
    password:String,
    verify:Boolean,
    otp:String
});
let datastudent=mongoose.model("student",Schema);
//student login
 let pchema=new mongoose.Schema({
    location:String,
    fname:String,
    lname:String,
    image:String,
    email:String,
    phone:String,
    password:String,
    verify:Boolean,
    otp:String
 })

let dataowner=mongoose.model("owner",pchema);



module.exports={datastudent,dataowner};