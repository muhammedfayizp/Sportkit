const isLogin=async(req,res,next)=>{
    try {
        if(req.session.admin){
            next()
        }else{
            res.redirect('/admin/')
        }
    } catch (error) {
        console.log(error);
    }
}
const isLogout=async(req,res,next)=>{
    try {
        if(!req.session.admin){
            next()
        }else{
            res.redirect('/admin/dashboard')
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports={
    isLogin,
    isLogout,
}