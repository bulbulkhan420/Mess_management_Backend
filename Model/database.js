const mongoose=require('mongoose');
const env=require('dotenv').config();
let url=process.env.DATABASE_URL;
mongoose.connect(url);
let Schema=new mongoose.Schema({
    fname:String,
    lname:String,
    name:String,
    image:String,
    email:String,
    phone:String,
    password:String,
    currentaddress:String,
    permanentaddress:String,
    currentmess:String,
    institution:String,
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

let seatschema=new mongoose.Schema({
    mess_name:String,
    mess_location:String,
    mess_owner:String,
    mess_owner_phone:String,
    mess_map:String,
    mess_seat_price:Number,
    mess_seat_type:String,
    mess_seat_image:String
})
let datamess=mongoose.model('messSeat',seatschema);
module.exports={datastudent,dataowner,datamess};