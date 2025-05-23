const express=require("express")
const app=express()

const dotenv=require("dotenv")
dotenv.config()

app.use(express.json())

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