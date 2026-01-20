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

const MONGODB = "mongodb+srv://fayizp6235:W7pTg7rpACHd2lnD@sportkit.7wgll3e.mongodb.net/?appName=sportkit"


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


// mongoose.connect("mongodb+srv://fayizp6235:W7pTg7rpACHd2lnD@sportkit.7wgll3e.mongodb.net/?appName=sportkit")

// mongoose.connect("mongodb://localhost:27017/sportkit")
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Mongodb Connected");
}).catch((err)=>{
    console.log("Failed to Connect Mongodb"+err);
})
console.log('success');

app.listen(3000,()=>{
    console.log('Server is running http://localhost:3000');
    console.log('Server is running http://localhost:3000/admin');
})
