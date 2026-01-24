const express=require("express")
const router=express.Router()
const { userLogin, userSignUp, getUser } =
  require("../controllers/userController.js");
router.post("/signUp",userSignUp)
router.post("/login",userLogin)
router.get("/:id",getUser)

module.exports=router