require('dotenv').config()
const express=require("express")
const connectDb=require("./db/db")
const authrouter = require('./routes/auth-route')
const homerouter = require('./routes/home.routes')
const adminrouter = require('./routes/admin.routes')
const uploadImageRoutes=require('./routes/image.routes')

connectDb()
const app=express()
const PORT=process.env.PORT || 3000
app.use(express.json())
app.use('/api/auth',authrouter)
app.use('/api/home',homerouter)
app.use('/api/admin',adminrouter)
app.use('/api/image',uploadImageRoutes)

app.listen(PORT,()=>{
    console.log(`Sever is running on port ${PORT}`)
})