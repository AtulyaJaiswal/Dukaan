import React, { Fragment, useState, useEffect } from "react";
import "./ForgotPassword.css";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import KeyIcon from '@mui/icons-material/Key';
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, forgotPassword } from "../../actions/userAction";
import { toast } from "react-toastify";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, loading, data } = useSelector( (state) => state.otpSender);

  const [email, setEmail] = useState("");
  const [emailBox, setEmailBox] = useState(true);
  const [otpBox, setOtpBox] = useState(false);
  const [userEnteredOtp, setUserEnteredOtp] = useState("");

  const sendOtpForgot = (e) => {
    e.preventDefault();
    if(email.trim()!==""){
      dispatch(forgotPassword(email));
      setEmailBox(false);
      setOtpBox(true);
      toast.success("Email Sent Successfully");
    }
    else{
      toast.error("Enter email properly");
    }
  }
  const verifyOtpForgot = (e) => {
    e.preventDefault();

    if(userEnteredOtp===data.otp.toString()){
      toast.success("OTP verified successfully");
      setOtpBox(false);
      navigate(`/password/reset/${userEnteredOtp}`, {
        state:{
          userEmail: email,
        }
      });
    }
    else{
      toast.error("Wrong OTP entered");
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Forgot Password" />
          <div className="forgotPasswordContainer">
            <div className="forgotPasswordBox">
              <h2 className="forgotPasswordHeading">Forgot Password</h2>

              <div className="signUpForm">
              <div className="signUpEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    disabled={!emailBox}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button 
                    className={!emailBox ? "sendVerifyOtpButtonDisable" : "sendVerifyOtpButton"} 
                    onClick={sendOtpForgot}
                    disabled={!emailBox}
                    >Send OTP
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
                    className={!otpBox ? "sendVerifyOtpButtonDisable" : "sendVerifyOtpButton"} 
                    // disabled={!otpBox}
                    onClick={verifyOtpForgot} 
                    >Verify OTP
                  </button>
                  <button
                    className={!otpBox ? "sendVerifyOtpButtonDisable" : "sendVerifyOtpButton"} 
                    disabled={!otpBox}
                    onClick={sendOtpForgot} 
                    >Resend OTP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ForgotPassword;