import React, { Fragment, useRef, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login, register } from "../../actions/userAction";
import { toast } from "react-toastify";
import {auth, provider} from "../../firebase";

const LoginSignUp = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");
    
      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

    const redirect = location.search ? location.search.split("=")[1] : "/account";

    const signIn = () => {
      auth
      .signInWithPopup(provider)
      .then(result => {
          // console.log(result);
          dispatch(login(result.user.email));
      })
      .catch(error => {
          toast.error(error.message);
      })
  };
  const signUp = () => {
    auth
    .signInWithPopup(provider)
    .then(result => {
        if(!isAuthenticated){
          const myForm = new FormData();
          myForm.set("name", result.user.displayName);
          myForm.set("email", result.user.email);
          myForm.set("avatar", result.user.photoURL);
          dispatch(register(myForm));
        }
    })
    .catch(error => {
        toast.error(error.message);
    })
};

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [dispatch, error, navigate, isAuthenticated, redirect]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
                <div className="login_signUp_toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button className="toogle" ref={switcherTab}></button>
              </div>
              <div className="loginForm" ref={loginTab} >
                <button onClick={signIn}>
                    <img
                      className="google_image"
                      src="https://play-lh.googleusercontent.com/6UgEjh8Xuts4nwdWzTnWH8QtLuHqRMUB7dp24JYVE2xcYzq4HA8hFfcAbU-R-PC_9uA1"
                      alt='Google'
                    />
                    Sign in with Google
                </button>
              </div>
              <div className="signUpForm" ref={registerTab}>
                <button onClick={signUp}>
                    <img
                      className="google_image"
                      src="https://play-lh.googleusercontent.com/6UgEjh8Xuts4nwdWzTnWH8QtLuHqRMUB7dp24JYVE2xcYzq4HA8hFfcAbU-R-PC_9uA1"
                      alt='Google'
                    />
                    Sign up with Google
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