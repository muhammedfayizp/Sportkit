const express=require('express')
const axios=require('axios')
const router=express()
const User=require('./models/user_model')
require("dotenv").config();


const CLIENT_ID=process.env.CLIENT_ID
const CLIENT_SECRET=process.env.CLIENT_SECRET
const REDIRECT_URI='http://localhost:3010/auth/google/callback'

router.get('/auth/google', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
});
router.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token, id_token } = data;

    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const existingUser=await User.findOne({email:profile.email})
    if(!existingUser){
      const newUser=new User({
        password:profile.id,
        name:profile.name,
        email:profile.email,
        is_admin:false,
        is_verified:1
        })
      
      const user=new User(newUser)
      await user.save()
      req.session.user=user._id
      }else{
        req.session.user=existingUser._id
      }
    res.redirect('/');
  } catch (error) {
    console.error('Error:', error);
    res.redirect('/login');
  }
});

router.get('/logout', (req, res) => {

  res.redirect('/login');
});

module.exports = router;
