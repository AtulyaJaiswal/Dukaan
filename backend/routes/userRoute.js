const express = require("express");
const { registerUser,
     loginUser, 
     logout, 
     resetPassword,
     getUserDetails, 
     updatePassword, 
     updateProfile, 
     getAllUsers, 
     getSingleUser, 
     updateUserRole, 
     deleteUser, 
     sendOtp, 
     registerUserUsingPassword,
     loginUsingPassword} = require("../controllers/userController");
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");

router.route("/register").post(registerUser);
router.route("/registerUsingPassword").post(registerUserUsingPassword);
router.route("/login").post(loginUser);
router.route("/loginUsingPassword").post(loginUsingPassword);
router.route("/logout").get(logout);
router.route("/sendOtp").post(sendOtp);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get((isAuthenticatedUser), getUserDetails);
router.route("/password/update").put((isAuthenticatedUser), updatePassword);
router.route("/me/update").put((isAuthenticatedUser), updateProfile);

router.route("/admin/users").get((isAuthenticatedUser), authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id")
    .get((isAuthenticatedUser), authorizeRoles("admin"), getSingleUser)
    .put((isAuthenticatedUser), authorizeRoles("admin"), updateUserRole)
    .delete((isAuthenticatedUser), authorizeRoles("admin"), deleteUser);

module.exports = router;