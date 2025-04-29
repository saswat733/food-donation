const mongoose=require('mongoose')

const donationSchema=new mongoose.Schema({
    donorName:{
        type:String,
        required:true
    },
    contactNumber:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    foodType:{
        type:String,
        enum:['vegetarian','non-vegetarian','vegan','bakedgoods']
    },
    quantity:{
        type:Number,
        required:true
    },
    freshness:{
        type:String,
        enum:['fresh','1day','2day','packaged'],
        required:true
    },
    pickupLocation:{
        type:String,
        required:true
    },
    instructions:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: true, // Ensure each donation is tied to a user
      },
});

const DonationSchema=mongoose.model("Donations",donationSchema);
module.exports= Donations;