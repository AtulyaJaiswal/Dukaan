import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import "./NotFound.css";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {

  const reload = () =>{
    window.location.reload();
  }

  return (
    <div className="PageNotFound">
      <ErrorIcon />

      <Typography>Page Not Found </Typography>
      <button onClick={reload}>Click to <span style={{fontWeight:"600"}}>Reload</span>  once</button>
      <Link to="/">Home</Link>
    </div>
  );
};

export default NotFound;