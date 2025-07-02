const bcrypt =require("bcryptjs")
const jwt=require("jsonwebtoken")

const userModel=require("../Models/userSchema")
const doubtModel = require("../Models/doubtSchema");

const generateJWT=(payload)=>{
    return jwt.sign(payload,process.env.SECRET_KEY, { expiresIn: "7d" })

}






const signup=async(req,res)=>{
    try {
        const {name,email,password,role}=req.body

        const userExist=await userModel.findOne({email})

        if(userExist){
            return res.status(409).json({message:"User already Exist"})
        }
      
        if(!name || !email || !password){
          return res.status(403).json({message:"name,email,password these are fields are required!!"})
        }

            if (!role || !["student", "teacher"].includes(role)) {
      return res.status(400).json({ message: "Role must be either 'student' or 'teacher'" });
    }
      
        const hashedPassword=await bcrypt.hash(password,10)
        // req.body.password = bcrypt.hash(req.body.password, 10)
        const newUser=new userModel({name,email,password:hashedPassword,role})
        // const newUser=new userSignupModel(req.body)
        await newUser.save()

        res.status(200).json({message:"User registred successfully", success:true})


      
    } catch (error) {
        res.status(500).json({message: error.message, success: false})
        
    }
}



const login=async(req,res)=>{
    try {
        const {email,password}=req.body
    
        const isUserRegistered=await userModel.findOne({email})
    
        if(!isUserRegistered){
            return res.status(403).json({message:"User not registered"})
        }
        const isPasswordValid=await bcrypt.compare(password,isUserRegistered.password)

        if(!isPasswordValid){
            return res.status(401).json({ message: "Invalid credentials" });
        }
       await userModel.findByIdAndUpdate(isUserRegistered._id, { isOnline: true }); // ✅ Update isOnline to true

        const token = generateJWT({ 
        userId: isUserRegistered._id, 
        email: isUserRegistered.email, 
        role: isUserRegistered.role 
        });

        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:true,
            maxAge:7*24*60*60*1000
    
        })


      res.status(201).json({
        message: "Login Successfully",
        success: true,
        user: {
          id: isUserRegistered._id,
          name: isUserRegistered.name,
          role: isUserRegistered.role,
        },
      });
        
    } catch (error) {
        res.status(500).json({message:"Internal server error",error})
    }
}



const logout=async(req,res)=>{
    try {
        if(!req.cookies.token){
            return res.status(400).json({message:"No cookie is present"})
        }

        // ✅ Set isOnline to false for the logged-in user
    await userModel.findByIdAndUpdate(req.user._id, { isOnline: false });

        res.clearCookie("token",{
            httpOnly:true,
            secure:true,
            sameSite:true,
        })

        return res.status(200).json({message:"Logout successfully"})
    } catch (error) {
        res.status(500).json({message:"Internal server error",error})
    }
}


const showUsers=async(req,res)=>{
    try {
        const allUsers=await userModel.find()
        
        res.status(200).json({message:"All users fetched successfully ",allUsers})
        
    } catch (error) {
        res.status(500).json({message:"Internal server error",error: error.message})
        
    }

}



const updateProfile = async (req, res) => {
  try {
    const { subjects, isAvailable } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        ...(subjects && { subjects }),
        ...(typeof isAvailable === "boolean" && { isAvailable }),
      },
      { new: true }
    );

    res.status(200).json({ message: "Profile updated", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

















const askDoubt = async (req, res) => {
  try {
    const { question, subject, studentSocketId } = req.body;

    if (!question || !subject || !studentSocketId) {
      return res.status(400).json({ message: "All fields required." });
    }

    // Create new doubt
    const newDoubt = new doubtModel({
      studentId: req.user._id,
      question,
      subject,
      studentSocketId,
    });

    // Find available teacher
    const teacher = await userModel.findOne({
      role: "teacher",
      isOnline: true,
      isAvailable: true,
      subjects: subject,
      socketId: { $exists: true },
    });

    await newDoubt.save();

    if (teacher) {
      // Send doubt to teacher via socket
      const io = req.app.get("io"); // You must store io instance on app object in server.js
      io.to(teacher.socketId).emit("incoming_doubt", {
        doubtId: newDoubt._id,
        studentName: req.user.name,
        question,
        subject,
        studentSocketId,
      });

      return res.status(200).json({
        message: "Doubt sent to teacher",
        doubtId: newDoubt._id,
      });
    } else {
      return res.status(200).json({
        message: "No available teacher",
        doubtId: newDoubt._id,
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal error", error: error.message });
  }
};

























module.exports={
    signup,
    login,
    logout,

    showUsers,
    updateProfile,



    askDoubt
}