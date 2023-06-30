import React, { Fragment, useRef, useState, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  login,
  register,
  sendOTP,
  registerUsingPassword,
  loginUsingPassword,
} from "../../actions/userAction";
import { toast } from "react-toastify";
import { auth, provider } from "../../firebase";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import KeyIcon from "@mui/icons-material/Key";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import FaceIcon from "@mui/icons-material/Face";
import Profile from "../../Images/Profile.png";
import MetaData from "../layout/MetaData";

const LoginSignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const {
    error: otpError,
    loading: otpLoading,
    data,
  } = useSelector((state) => state.otpSender);

  const typesOfUsers = ["User", "Vendor"];

  const [typeOfUser, setTypeOfUser] = useState("User");
  const [userEnteredOtp, setUserEnteredOtp] = useState("");
  const [emailBox, setEmailBox] = useState(true);
  const [passwordBox, setPasswordBox] = useState(false);
  const [otpBox, setOtpBox] = useState(false);
  const [email, setEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(Profile);
  const [avatarPreview, setAvatarPreview] = useState(Profile);

  const sendOtp = (e) => {
    e.preventDefault();
    if (email.trim() !== "") {
      dispatch(sendOTP(email));
      setEmailBox(false);
      setOtpBox(true);
      toast.success("Email Sent Successfully");
    } else {
      toast.error("Enter email properly");
    }
  };
  const verifyOtp = (e) => {
    e.preventDefault();

    if (userEnteredOtp === data.otp.toString()) {
      toast.success("OTP verified successfully");
      setOtpBox(false);
      setPasswordBox(true);
    } else {
      toast.error("Wrong OTP entered");
    }
  };
  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      loginTab.current.classList.add("shiftToNeutralForm");
      registerTab.current.classList.add("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      loginTab.current.classList.remove("shiftToNeutralForm");
      registerTab.current.classList.remove("shiftToLeft");
    }
  };

  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch(login(result.user.email));
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const loginUser = () => {
    if (loginEmail.trim() === "" || loginPassword.trim() === "") {
      toast.error("Enter email or password properly");
    }
    dispatch(loginUsingPassword(loginEmail, loginPassword));
  };

  const signUp = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        if (!isAuthenticated) {
          const myForm = new FormData();
          myForm.set("name", result.user.displayName);
          myForm.set("email", result.user.email);
          myForm.set("avatar", result.user.photoURL);
          myForm.set("role", typeOfUser === "User" ? "user" : "vendor");
          dispatch(register(myForm));
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const registerUser = (e) => {
    e.preventDefault();

    if (name.trim === "" || name.length < 3) {
      toast.error("Enter proper Username");
    }

    if (password.length < 8) {
      toast.error("Password must be greater than 8 length");
    }
    if (avatar === "/static/media/Profile.5c163bc80773d22cc37a.png") {
      toast.error("Upload a profile picture");
    }
    dispatch(
      registerUsingPassword(
        email,
        password,
        avatar,
        name,
        typeOfUser === "User" ? "user" : "vendor"
      )
    );
  };

  const redirect = location.search ? location.search.split("=")[1] : "/account";

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (otpError) {
      toast.error(otpError);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [dispatch, error, navigate, isAuthenticated, redirect, otpError]);

  return (
    <Fragment>
      {loading || otpLoading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Login/Register" />
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
                <div className="login_signUp_toggle">
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                </div>
                <button className="toogle" ref={switcherTab}></button>
              </div>

              <div className="signUpForm" ref={registerTab}>
                <div className="typeOfUser">
                  <select
                    className="typeOfUserSelect"
                    onChange={(e) => setTypeOfUser(e.target.value)}>
                    {typesOfUsers.map((user) => (
                      <option
                        className="typeOfUserOption"
                        key={user}
                        value={user}>
                        {user}
                      </option>
                    ))}
                  </select>
                </div>
                <button onClick={signUp}>
                  <img
                    className="google_image"
                    src="https://play-lh.googleusercontent.com/6UgEjh8Xuts4nwdWzTnWH8QtLuHqRMUB7dp24JYVE2xcYzq4HA8hFfcAbU-R-PC_9uA1"
                    alt="Google"
                  />
                  Sign up with Google
                </button>
                <div className="or">
                  <h4>OR</h4>
                </div>
                <div className="signUpEmail">
                  <MailOutlinedIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    disabled={!emailBox}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    className={
                      !emailBox
                        ? "sendVerifyOtpButtonDisable"
                        : "sendVerifyOtpButton"
                    }
                    onClick={sendOtp}
                    disabled={!emailBox}>
                    Send OTP
                  </button>
                </div>
                <div className="signUpEmail">
                  <KeyIcon />
                  <input
                    type="number"
                    placeholder="Enter OTP"
                    required
                    disabled={!otpBox}
                    value={userEnteredOtp}
                    onChange={(e) => setUserEnteredOtp(e.target.value)}
                  />
                  <button
                    className={
                      !otpBox
                        ? "sendVerifyOtpButtonDisable"
                        : "sendVerifyOtpButton"
                    }
                    disabled={!otpBox}
                    onClick={verifyOtp}>
                    Verify OTP
                  </button>
                  <button
                    className={
                      !otpBox
                        ? "sendVerifyOtpButtonDisable"
                        : "sendVerifyOtpButton"
                    }
                    disabled={!otpBox}
                    onClick={sendOtp}>
                    Resend OTP
                  </button>
                </div>
                <div className="signUpEmail">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Enter Your Name"
                    required
                    disabled={!passwordBox}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenOutlinedIcon />
                  <input
                    type="password"
                    placeholder="Enter Password"
                    required
                    disabled={!passwordBox}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <button
                  disabled={!passwordBox}
                  onClick={registerUser}
                  className={passwordBox ? "signUpBtn" : "signUpBtnDisable"}>
                  Register
                </button>
              </div>
              <div className="loginForm" ref={loginTab}>
                <button onClick={signIn}>
                  <img
                    className="google_image"
                    src="https://play-lh.googleusercontent.com/6UgEjh8Xuts4nwdWzTnWH8QtLuHqRMUB7dp24JYVE2xcYzq4HA8hFfcAbU-R-PC_9uA1"
                    alt="Google"
                  />
                  Sign in with Google
                </button>
                <div className="or">
                  <h4>OR</h4>
                </div>
                <div className="loginEmail">
                  <MailOutlinedIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenOutlinedIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Link to="/password/forgot">Forget Password ?</Link>
                <button onClick={loginUser} className="loginBtn">
                  Login
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
