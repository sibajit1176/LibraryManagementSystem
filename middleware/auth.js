const jwt=require("jsonwebtoken");
require('dotenv').config();
const SecretKey=process.env.SecretKey;

const auth=(req,res,next)=>{
    
    try {
        let token=req.session.token;
        if(token){
            let user=jwt.verify(token,SecretKey);
            console.log(user);
            res.userId=user.uid;
            next();
        }else{
        //    res.status(401).json({error:"Unuthorized user"})
           res.redirect("/login");
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({error:"something wrong"})
    }
}
const authPage=(permissions)=>{
   return (req,res,next)=>{
       let token=req.session.token;
       let user=jwt.verify(token,SecretKey);

       const userRole=user.userType;
       if(permissions.includes(userRole)){
           next()
       }else{
         res.redirect("/");
       }
   }
}
module.exports={auth,authPage};