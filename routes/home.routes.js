const express=require("express")
const authMiddleware = require("../middleware/auth")
const router=express.Router()

router.get('/welcome',authMiddleware,(req,res)=>{
    const{username,userId,role}=req.userInfo

    res.json({
        message:"welcome to home page",
        user:{
            _id:userId,
            username:username,
            role:role
        }
    })

})
module.exports=router