const mongoose=require("mongoose")

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB is connected")
        
    } catch (error) {
        console.log("MongoDB connection is failed",error)
        
    }
}

module.exports=connectDB