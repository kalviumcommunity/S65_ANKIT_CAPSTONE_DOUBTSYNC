const bcrypt =require("bcryptjs")
const jwt=require("jsonwebtoken")

const userModel=require("../Models/userSchema")
const doubtModel = require("../Models/doubtSchema");

const generateJWT=(payload)=>{
    return jwt.sign(payload,process.env.SECRET_KEY, { expiresIn: "7d" })

}



const signup=async(req,res)=>{
  const {name,email,password,role}=req.body
  try {
        if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
        }
  

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
        const newUser=new userModel({name,email,password:hashedPassword,role})
        await newUser.save()

        res.status(200).json({message:"User registred successfully", success:true})


  }
     catch (error) {
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
        await userModel.findByIdAndUpdate(isUserRegistered._id, { isOnline: true });  // as the user logins , after veriying the credentials , setting "isOnline true"
          const token = generateJWT({ 
          userId: isUserRegistered._id, 
          email: isUserRegistered.email, 
          role: isUserRegistered.role 
          });

          res.cookie("token",token,{
              httpOnly:true,
              secure: process.env.NODE_ENV === "production",  
              sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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



const logout = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({ message: "No cookie is present" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    
    await userModel.findByIdAndUpdate(decoded.userId, { isOnline: false }); // as the user logout , setting "isOnline false"


    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // set true in production with HTTPS
      sameSite: "lax", // "strict" or "lax"
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


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


















const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update user by ID
const updateUserById = async (req, res) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
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

    // Find ALL available teachers for this subject
    const availableTeachers = await userModel.find({
      role: "teacher",
      isOnline: true,
      isAvailable: true,
      subjects: subject,
      socketId: { $exists: true }
    });

    console.log(`Found ${availableTeachers.length} available teachers for ${subject}`);

    await newDoubt.save();

    if (availableTeachers.length > 0) {
      const io = req.app.get("io");
      
   
      availableTeachers.forEach(teacher => {   // sending doubt to all avaible teacher
        console.log(`Sending doubt to teacher ${teacher._id} with socket ${teacher.socketId}`);
        io.to(teacher.socketId).emit("incoming_doubt", {
          doubtId: newDoubt._id,
          studentName: req.user.name,
          question,
          subject,
          studentSocketId,
        });
      });

      return res.status(200).json({
        message: `Doubt sent to ${availableTeachers.length} teachers`,
        doubtId: newDoubt._id,
      });
    }

    return res.status(200).json({
      message: "No available teacher",
      doubtId: newDoubt._id,
    });

  } catch (error) {
    console.error("Error in askDoubt:", error);
    return res.status(500).json({ message: "Internal error", error: error.message });
  }
};





const tryAssignTeacher = async (req, res) => {
  try {
    const { doubtId } = req.body;
    const io = req.app.get("io");

    if (!doubtId) {
      return res.status(400).json({ message: "Doubt ID is required." });
    }

    const doubt = await doubtModel.findById(doubtId);
    if (!doubt || doubt.isResolved || doubt.isAssigned) {
      return res.status(404).json({ message: "Invalid or already assigned/resolved doubt." });
    }

    const teacher = await userModel.findOne({
      role: "teacher",
      isOnline: true,
      isAvailable: true,
      subjects: doubt.subject,
      socketId: { $exists: true },
    });

    if (teacher) {
      doubt.isAssigned = true;
      doubt.assignedTeacherId = teacher._id;
      await doubt.save();

      io.to(teacher.socketId).emit("incoming_doubt", {
        doubtId: doubt._id,
        studentName: "Student",
        question: doubt.question,
        subject: doubt.subject,
        studentSocketId: doubt.studentSocketId,
      });

      return res.status(200).json({ message: "Doubt reassigned to a teacher." });
    }

    return res.status(200).json({ message: "No teacher available yet." });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};




















module.exports={
    signup,
    login,
    logout,

    showUsers,
    updateProfile,



    askDoubt,
    tryAssignTeacher,

    getUserById,
    updateUserById

}