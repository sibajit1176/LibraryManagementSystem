const express =require("express");
const router=express.Router();
const Book=require('../Models/book');
const addProfile=require('../Models/profile')
const {auth,authPage}=require("../middleware/auth");
const jwt=require("jsonwebtoken");
const multer=require('multer');
const SecretKey="Sibajit";


var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads')
    },
    filename:function(req,file,cb){
     cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname)
    }
});

//middleware
var upload=multer({
    storage:storage,
}).single("image");

//Insert book in database
router.post('/Add',upload, async (req,res)=>{
    const book=new Book({
        bookname:req.body.bookname,
        authorname:req.body.authorname,
        price:req.body.price,
        summary:req.body.summary,
        image:req.file.filename,
        mark:false
    });
    try{
        await book.save();
        res.redirect("/Add");
    }catch(error)
    {
        console.log(error);
    }
    

})
//get all data
router.get("/",async(req,res)=>{
    let data=await Book.find();
    const loggedIn=req.cookies.loggedIn || 'false';
    const isAdmin=req.cookies.isAdmin || 'false';
    const userName=req.cookies.userName || 'Wellcome';
    res.render('index',{
        title:'Home page',
        books:data,
        loggedIn,
        isAdmin,
        userName
    });
})
// show book which borrow
router.get("/Profile",auth,async(req,res)=>{
    const loggedIn=req.cookies.loggedIn || 'false';
    const isAdmin=req.cookies.isAdmin || 'false';
    const userName=req.cookies.userName || 'User';
    const token=req.session.token;
    let user= jwt.verify(token,SecretKey);
    let data=await addProfile.find({userId:user.id});
    res.render('user_profile',{
        title:'Profile',
        addBook:data,
        loggedIn,
        isAdmin,
        userName
    });
})

//borrow book
router.get("/Profile/:id",async(req,res)=>{
    let result=await Book.findOne({_id:req.params.id});
    const token=req.session.token;
    let user=jwt.verify(token,SecretKey);
    const borrow=new addProfile({
        bookname:result.bookname,
        authorname:result.authorname,
        price:result.price,
        summary:result.summary,
        image:result.image,
        bookId:req.params.id,
        userId:user.id
    });
   let data=await Book.updateOne(
        { _id: req.params.id },
        { mark: true }
      );
    borrow.save();
    res.redirect("/") ;
})
//return book
router.get("/Home/:id",async(req,res)=>{
    const data=await addProfile.findOne({_id:req.params.id});
    await addProfile.deleteOne({_id:req.params.id})
    let result=await Book.updateOne(
        { _id: data.bookId },
        { mark: false }
      );
    res.redirect("/Profile");
})
//add book details
router.get("/Add",authPage(["admin"]),(req,res)=>{
    const loggedIn=req.cookies.loggedIn || 'false';
    const isAdmin=req.cookies.isAdmin || 'false';
    const userName=req.cookies.userName || 'User';
    res.render("add_book",{title:"Add Book",
                            loggedIn,
                            isAdmin,
                            userName})
})

module.exports = router;