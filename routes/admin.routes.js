const express=require("express")
const authMiddleware = require("../middleware/auth")
const isAdminUser = require("../middleware/admin")
const router=express.Router()

router.get('/welcome',authMiddleware,isAdminUser,(req,res)=>{
    res.json({
        message:"welcome to the admin page"
    })
})
module.exports=router