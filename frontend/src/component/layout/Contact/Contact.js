import React, { Fragment } from "react";
import "./Contact.css";
import { Button } from "@mui/material";
import MetaData from "../MetaData";

const Contact = () => {
  return (
     <Fragment>
      <MetaData title="Contact"/>
      <div className="contactContainer">
        <a className="mailBtn" href="mailto:atulyajaiswal@yahoo.com">
          <Button>Contact: dukaan@yahoo.com</Button>
        </a>
      </div>
     </Fragment>
  );
};

export default Contact;