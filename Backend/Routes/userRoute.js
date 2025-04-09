const express=require("express")
const router=express.Router()


const {signup, logout}=require("../Controllers/userController")
const {login}=require("../Controllers/userController")
const {logout}=require("../Controllers/userController")

const {showUsers}=require("../Controllers/userController")




router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout);

router.get("/showuser",showUsers);





