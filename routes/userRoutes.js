const express=require("express");
const userRoutes=express.Router();
const {signup,login,logout}=require("../controllers/user")
const User=require("../Models/user");

userRoutes.get("/signup",(req,res)=>{
    const loggedIn=req.cookies.loggedIn || 'false';
    const isAdmin=req.cookies.isAdmin || 'false';
    const userName=req.cookies.userName || 'Wellcome';
    res.render("register",{
        title:"Register",
        loggedIn,
        isAdmin,
        userName
    })
})
userRoutes.post("/signup",signup);
userRoutes.get("/login",(req,res)=>{
    const loggedIn=req.cookies.loggedIn || 'false';
    const isAdmin=req.cookies.isAdmin || 'false';
    const userName=req.cookies.userName|| 'Wellcome';
    res.render("login",{
        title:"Login",
        loggedIn,
        isAdmin,
        userName
    })
})
userRoutes.post("/login",login);
userRoutes.get("/logout",logout);

module.exports=userRoutes