const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const UserPassword = require('../models/userModel2');

exports.isAuthenticatedUser = catchAsyncErrors( async(req,res,next) => {

    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please login to access this resource",401));
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRET);    

    req.user = await User.findById(decodeData.id);
    if(req.user===null){
        req.user = await UserPassword.findById(decodeData.id);
    }
    next();
});

exports.authorizeRoles = (...roles) => {
    return(req,res,next) => {
        if(!roles.includes(req.user.role)){ 
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource`, 403
                )
            );
        }
        next();
    };
}
