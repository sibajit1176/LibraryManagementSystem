const usermodel=require("../Models/user");
const jwt=require("jsonwebtoken");
require('dotenv').config();
const bcrypt=require("bcrypt")
const SecretKey=process.env.SecretKey;

const signup=async(req,res)=>{
    let data=await req.body;
    try{
        const userexit=await usermodel.findOne({id:data.id});
        if(userexit){
            console.log("user exit");
        }else{
           const hashPassword=await bcrypt.hash(data.password,10);
           let result=await usermodel.create({
            userType:data.userType,
            name:data.name,
            id:data.id,
            password:hashPassword
           })
           const token=jwt.sign({uid:result.id,id:result._id,userType:result.userType,name:result.name},SecretKey,{expiresIn:"24h"});
           res.cookie('token',token,{
               httpOnly:true
           }) 
           res.redirect("/login");
        }
    }catch(error){
        console.log(error);
    }
}

const login=async(req,res)=>{
    const data=req.body;
    try{
        const userexit=await usermodel.findOne({id:data.id});
        if(!userexit){
            return res.status(400).json({error:"user not found"});
        }
        const matchpassword=await bcrypt.compare(data.password,userexit.password);
        if(!matchpassword){
            return res.status(401).json({error:"Invalid Password"})
        }
        const token=jwt.sign({uid:userexit.id,id:userexit._id,userType:userexit.userType,name:userexit.name},SecretKey,{expiresIn:"24h"})
        req.session.token=token;
        res.cookie('isAdmin',userexit.userType);
        res.cookie('loggedIn',true);
        res.cookie('userName',userexit.name);
        res.redirect("/");
    }catch(error){
        return res.status(401).json({error:"somethings wrong"})
    }
}
const logout=(req,res)=>{
    req.session.destroy((err)=>{
       if(err){
           console.log(err);
       }else{
           res.clearCookie('loggedIn');
           res.clearCookie('isAdmin');
           res.clearCookie('userName');
           res.redirect("/");
       }
    })
}
module.exports={signup,login,logout};