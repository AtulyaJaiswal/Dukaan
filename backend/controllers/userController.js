const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require('../models/userModel');
const UserPassword = require('../models/userModel2');
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;

//REGISTER USER
exports.registerUser = catchAsyncErrors(async(req,res,next) => {

    const { name,email,avatar} = req.body; 
    
    const userExist = await User.findOne({ email }); 
    const userPasswordExist = await UserPassword.findOne({ email }); 

    if(userExist || userPasswordExist){
        return next(new ErrorHandler("User already registered, try logging in",401));
    }

    const user = await User.create({
        name,email,
        avatar:{
            public_id: avatar,
            url: avatar,
        }
    });

    sendToken(user,201,res);
});

//REGISTER USER USING PASSWORD
exports.registerUserUsingPassword = catchAsyncErrors(async(req,res,next) => {

    const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 300,
        crop: "scale"
    });
    console.log(myCloud);

    const { name,email,password} = req.body;

    const userPasswordExist = await UserPassword.findOne({ email }); 
    const userExist = await User.findOne({ email }); 

    if(userExist || userPasswordExist){
        return next(new ErrorHandler("User already registered, try logging in",401));
    }

    const user = await UserPassword.create({
        name,email,password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });

    sendToken(user,201,res);
});


//LOGIN USER
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email} = req.body;

    const user = await User.findOne({ email }); 

    const userPassword = await UserPassword.findOne({ email }); 
    if(userPassword){
        return next(new ErrorHandler("Login using email and password", 401));
    }

    if(!user){
        return next(new ErrorHandler("Not Registered",401));
    }
    
    sendToken(user,200,res);

});

//LOGIN USER USING PASSWORD
exports.loginUsingPassword = catchAsyncErrors(async(req,res,next)=>{

    const {email,password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password both", 400));
    }

    const user = await UserPassword.findOne({ email }).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    sendToken(user,200,res);

});

//LOGOUT USER
exports.logout = catchAsyncErrors(async (req,res,next) =>{

    res.cookie("token",null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

//FORGOT PASSWORD
exports.sendOtp = catchAsyncErrors(async (req,res,next) => {

    let message = "";
    let otp = Math.floor(100000 + Math.random() * 900000);

    if(req.body.str==="forgot"){
        const user = await UserPassword.findOne({email: req.body.email});

        if(!user){
            return next(new ErrorHandler("User not found", 404));
        }

        
        //MESSAGE TO BE SENT ON EMAIL
        message = `Your Password reset OTP is :- ${otp}
        \n If you have not requested this email, please ignore it`;
    }

    else if(req.body.str==="otp"){  

        const {email} = req.body;
        
        const userPasswordExist = await UserPassword.findOne({ email }); 
        const userExist = await User.findOne({ email }); 

        if(userExist || userPasswordExist){
            return next(new ErrorHandler("User already registered, try logging in",401));
        }
        
        //MESSAGE TO BE SENT ON EMAIL
        message = `Your OTP for registration is :- ${otp}
        \n If you have not requested this email, please ignore it`;
    }
   try {

        await sendEmail({
            email: req.body.email,
            subject: `OTP for verification`,
            message,
        });
        res.status(200).json({
            success:true,
            message: `Email sent successfully`,
            otp,
        });
    
   } catch (error) {
        return next(new ErrorHandler(error.message, 500));
   }
});


//RESET PASSWORD
exports.resetPassword = catchAsyncErrors(async(req,res,next) => {
    
    const email = req.body.userEmail;

    const user = await UserPassword.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Please Try Again", 400));
    }
    
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.password;

    await user.save();

    res.status(200).json({
        success:true,
        message: "Password Updated Successfully",
    });
});

//GET USER DETAILS
exports.getUserDetails = catchAsyncErrors(async (req,res,next) => {

    let user = await User.findById(req.user.id);
    // console.log(user);
    if(!user){
        user = await UserPassword.findById(req.user.id);
    }

    // console.log(user);

    res.status(200).json({
        success:true,
        user,
    });
});

//UPDATE USER PASSWORD
exports.updatePassword = catchAsyncErrors(async(req,res,next) => {

    const user = await UserPassword.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});

//UPDATE USER PROFILE
exports.updateProfile = catchAsyncErrors(async(req,res,next) => {

    const newUserData = {
        name: req.body.name,
        // email: req.body.email,
    };
    
    //CLOUDINARY FOR AVATAR
    if(req.body.avatar !==""){
        const user = await User.findById(req.user.id);
        // console.log(user.avatar.public_id);
        if(req.user.avatar.public_id !== req.user.avatar.url){
            const imageId = user.avatar.public_id;

            //deletes the previous photo
            await cloudinary.uploader.destroy(imageId);
        }
        
        const myCloud = await cloudinary.uploader.upload(req.body.avatar,{
            folder: "avatars",
            width: 300,
            crop: "scale"
        });
        // console.log(myCloud);
        // .then(result=>console.log(result));
        // console.log("R3")
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new:true,
        runValidators:true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});


//GET ALL USERS (ADMIN)
exports.getAllUsers = catchAsyncErrors(async(req,res,next) => {

    const  users1 = await User.find();
    const users2 = await UserPassword.find();

    res.status(200).json({
        success:true,
        users: [...users1, ...users2],
    });
});

//GET SINGLE USER (ADMIN)
exports.getSingleUser = catchAsyncErrors(async(req,res,next) => {

    let user = await User.findById(req.params.id);

    if(!user){
        user = await UserPassword.findById(req.params.id);
    }

    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

//UPDATE USER ROLE
exports.updateUserRole = catchAsyncErrors(async(req,res,next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.user.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new:true,
        runValidators:true,
        useFindAndModify: false,
    });
    if(!user){
        await UserPassword.findByIdAndUpdate(req.params.id, newUserData, {
            new:true,
            runValidators:true,
            useFindAndModify: false,
        });
    }

    res.status(200).json({
        success: true,
    });
});

//DELETE USER --ADMIN
exports.deleteUser = catchAsyncErrors(async(req,res,next) => {

    let user = await User.findById(req.params.id);

    if(!user){
        user = await UserPassword.findById(req.params.id);
    }

    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
    }

    const imageId = user.avatar.public_id;

    //deletes the previous photo
    await cloudinary.uploader.destroy(imageId);

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});

