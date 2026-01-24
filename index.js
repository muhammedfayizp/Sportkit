const express=require('express')
const app=express()
require('dotenv').config();
const mongoose=require('mongoose')
const path=require('path')
const authRoute=require('./authRoute')
const bodyParser=require('body-parser');
const flash = require('express-flash');
const nocache=require('nocache')
const userRoute=require('./Routes/userRoute');
const adminRoute=require('./Routes/adminRoute');


app.use(flash())
app.use(nocache())
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//User Route
app.use('/',userRoute)

//admin Route
app.use('/admin',adminRoute)


app.use('/',authRoute)


mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Mongodb Connected");
}).catch((err)=>{
    console.log("Failed to Connect Mongodb"+err);
})
console.log('success');

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    // console.log('Server is running http://localhost:3000');
    // console.log('Server is running http://localhost:3000/admin');

    console.log(`Server running on port ${PORT}`);
})
