const bcrypt =require("bcryptjs")
const userModel=require("../Models/userSchema")



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
      
        const hashedPassword=await bcrypt.hash(password,10)
        // req.body.password = bcrypt.hash(req.body.password, 10)
        const newUser=new userModel({name,email,password:hashedPassword})
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

        const token= await generateJWT({userId:isUserRegistered._id,email})
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:true,
            maxAge:7*24*60*60*1000
    
        })


        res.status(201).json({message:"Login Successfully",success:true})
        
    } catch (error) {
        res.status(500).json({message:"Internal server error",error})
    }
}



const logout=(req,res)=>{
    try {
        if(!req.cookies.token){
            return res.status(400).json({message:"No cookie is present"})
        }

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

const updateProfile = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({ message: "Email, old password, and new password are required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(403).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully", success: true });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
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




module.exports={
    signup,
    login,
    logout,

    showUsers,

    updateProfile
}
