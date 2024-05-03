const isLogin=async(req,res,next)=>{
    try {
        if(req.session.user){
            next()
        }else{
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error);
    }
}
const isLogout=async(req,res,next)=>{
    try {
        if(!req.session.user){
            next()
        }
        else{
            res.redirect('/')
        }
    } catch (error) {
        console.log(error);
    }
}
const isUser=async(req,res,next)=>{
    try {
        if(req.session&&req.session.user){
            res.locals.navbar=true
            return next()
        }else{
            res.locals.navbar=false
            return next()
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports={
    isLogin,
    isLogout,
    isUser
}