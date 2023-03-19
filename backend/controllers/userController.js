const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require('../models/userModel');
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;

//REGISTER USER
exports.registerUser = catchAsyncErrors(async(req,res,next) => {

    const { name,email,avatar} = req.body; 
    
    const userExist = await User.findOne({ email }); 

    if(userExist){
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

//LOGIN USER
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email} = req.body;

    const user = await User.findOne({ email }); 

    if(!user){
        return next(new ErrorHandler("Not Registered",401));
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

// //FORGOT PASSWORD
// exports.forgotPassword = catchAsyncErrors(async (req,res,next) => {
//     const user = await User.findOne({email: req.body.email});

//     if(!user){
//         return next(new ErrorHandler("User not found", 404));
//     }

//     //GET ResetPasswordToken
//     const resetToken = user.getResetPasswordToken();

//     await user.save({validateBeforeSave: false});

//     const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;    
    
//    //MESSAGE TO BE SENT ON EMAIL
//    const message = `Your Password reset token is :- \n
//    \n ${resetPasswordUrl} \n
//    \n If you have not requested this email, please ignore it`;
   
//    try {

//         await sendEmail({
//             email: user.email,
//             subject: `Password recovery`,
//             message,
//         });
//         res.status(200).json({
//             success:true,
//             message: `Email sent to ${user.email} successfully`
//         });
    
//    } catch (error) {
//         user.resetPasswordToken=d=undefined;
//         user.resetPasswordExpire=undefined;
//         await user.save({validateBeforeSave: false});

//         return next(new ErrorHandler(error.message, 500));
//    }
// });


//RESET PASSWORD
exports.resetPassword = catchAsyncErrors(async(req,res,next) => {

    //create token hash to match token in database
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()},
    });

    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or expired", 400));
    }
    
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken=d=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();

    sendToken(user, 200, res);
});

//GET USER DETAILS
exports.getUserDetails = catchAsyncErrors(async (req,res,next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user,
    });
});

//UPDATE USER PASSWORD
exports.updatePassword = catchAsyncErrors(async(req,res,next) => {

    const user = await User.findById(req.user.id).select("+password");

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

    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    });
});

//GET SINGLE USER (ADMIN)
exports.getSingleUser = catchAsyncErrors(async(req,res,next) => {

    const user = await User.findById(req.params.id);

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

    res.status(200).json({
        success: true,
    });
});

//DELETE USER --ADMIN
exports.deleteUser = catchAsyncErrors(async(req,res,next) => {

    const user = await User.findById(req.params.id);

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

