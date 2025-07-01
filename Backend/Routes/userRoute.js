const express=require("express")
const router=express.Router()


const {signup,login, logout,showUsers,updateProfile}=require("../Controllers/userController")
const authenticate = require("../Middleware/authMiddleware");
const { askDoubt } = require("../Controllers/userController");

router.post("/ask-doubt", authenticate, askDoubt);




router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout);

router.get("/showuser",showUsers);

router.put("/updateprofile",authenticate,updateProfile)


module.exports=router



