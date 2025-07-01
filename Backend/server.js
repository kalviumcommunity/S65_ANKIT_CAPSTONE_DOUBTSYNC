const express=require("express")
const app=express()
const cookieParser = require("cookie-parser");

const dotenv=require("dotenv")
dotenv.config()

app.use(express.json())
app.use(cookieParser()); 

const connectDB=require("./config/db")
connectDB()

const userRoutes=require("./Routes/userRoute")
app.use("/",userRoutes)

app.get("/",(req,res)=>{
    res.send("root page")
})

app.listen(process.env.PORT,()=>{
    console.log("Server is running")
})