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
    messname:String,
    phone:String,
    mess_map:String,
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
    mess_email:String,
    mess_map:String,
    mess_room_number:String,
    mess_room_description:String,
    mess_seat_price:Number,
    mess_seat_type:String,
    student_booked:String,
    available:Boolean,
    student_number:String,
    student_email:String,
    mess_seat_image:String,
    time:Object
})

let datamess=mongoose.model('messSeat',seatschema);

let studentseat=new mongoose.Schema({
    tran_id:String,
    student_email:String,
    mess_id:String,
    rent:Number,
    Booking_date:String,
    last_payment_date:Object
   
   

})
let datastudentseat=mongoose.model('studentseat',studentseat);

let postsc=new mongoose.Schema({
    mess_email:String,
    mess_name:String,
    mess_post:String,
    postdate:String,
});
let datamessnotice=mongoose.model('notice',postsc);
module.exports={datastudent,dataowner,datamess,datastudentseat,datamessnotice};