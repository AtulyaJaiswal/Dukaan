import React, { Fragment, useState, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
import { useNavigate, useLocation, useAsyncError} from "react-router-dom";
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("")

    const redirect = location.search ? location.search.split("=")[1] : "/account";

    const signIn = () => {
      auth
      .signInWithPopup(provider)
      .then(result => {
          console.log(result);
          dispatch(login(result.user.email));
          if(!isAuthenticated){
            setName(result.user.displayName);
            setEmail(result.user.email);
            setAvatar(result.user.photoURL);
            const myForm = new FormData();
            myForm.set("name", name);
            myForm.set("email", email);
            myForm.set("avatar", avatar);
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
              <div className="login">
                <button onClick={signIn}>
                    <img
                      src="https://play-lh.googleusercontent.com/6UgEjh8Xuts4nwdWzTnWH8QtLuHqRMUB7dp24JYVE2xcYzq4HA8hFfcAbU-R-PC_9uA1"
                      alt='Google'
                    />
                    Sign in with Google
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