const express=require('express')
const app=express()
const mongoose=require('mongoose')
const path=require('path')
const authRoute=require('./authRoute')
const bodyParser=require('body-parser');
const flash = require('express-flash');
const nocache=require('nocache')
const userRoute=require('./Routes/userRoute');
const adminRoute=require('./Routes/adminRoute');

mongoose.connect("mongodb://127.0.0.1:27017/Sportkit");


app.use(flash())
app.use(nocache())
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:true}))

//User Route
app.use('/',userRoute)

//admin Route
app.use('/admin',adminRoute)


app.use('/',authRoute)

app.listen(3010,()=>{
    console.log('Server is running http://localhost:3010');
    console.log('Server is running http://localhost:3010/admin');
})