const express=require("express")
const router=express.Router()


const {signup,login, logout,showUsers,updateProfile}=require("../Controllers/userController")


router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout);

router.get("/showuser",showUsers);

router.put("/updateprofile",updateProfile)


module.exports=router



