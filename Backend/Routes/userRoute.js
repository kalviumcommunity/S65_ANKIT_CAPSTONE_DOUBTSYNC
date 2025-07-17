const express=require("express")
const router=express.Router()


const {signup,login, logout,showUsers,updateProfile,tryAssignTeacher,  getUserById,updateUserById}=require("../Controllers/userController")
const authenticate = require("../Middleware/authMiddleware");
const { askDoubt } = require("../Controllers/userController");

router.post("/ask-doubt", authenticate, askDoubt);


router.post("/try-assign-teacher", tryAssignTeacher);



router.post("/signup",signup)
router.post("/login",login)
router.post("/logout", logout); 



router.get("/showuser",showUsers);

router.put("/updateprofile",authenticate,updateProfile)

router.get("/user/:id",getUserById);
router.put("/user/:id", updateUserById);


router.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role
    }
  });
});



module.exports=router



