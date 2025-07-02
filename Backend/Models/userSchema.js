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

    subjects: {
        type: [String], // Array of subjects, like ['DSA', 'AI', 'Career']
        default: []
    },
    isOnline:{
        type:Boolean,
        enum:[true,false],
        default:false

    },

     isAvailable: {
        type: Boolean, 
        default: false
    },


    socketId: {
        type: String,
        default: null
     }
})





module.exports=mongoose.model("User",userSchema,"users")