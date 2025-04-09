const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{type:String,required:true,minLength:3},
    email:{type:String,required:true},
    password:{type:String,required:true,minLength:3},

    role:{ 
        type:String,
        enum:["student","teacher"],
        default:"student"
    },

    isOnline:{
        type:Boolean,
        enum:[true,false],
        default:false

    }
})





module.exports=mongoose.model("User",userSchema,"users")