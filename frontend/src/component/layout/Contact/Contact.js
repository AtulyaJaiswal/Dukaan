import React, { Fragment } from "react";
import "./Contact.css";
import MetaData from "../MetaData";
import Contact2 from "../../../Images/contact2.avif";


const Contact = () => {
  return (
     <Fragment>
      <MetaData title="Contact"/>
      <div className="contactContainer">
        
        <div>
          <img
            src={Contact2}
            alt="contact"
          />
        </div>
        <div className="contact_queries">
          <p>Have some queries?</p>
        </div>
        <div className="contact_mailBtn">
          <a className="mailBtn" href="mailto:atulyajaiswal@yahoo.com">
            <button>Contact: dukaan@yahoo.com</button>
          </a>
          <p>Call us at:- +91 9876543210</p>
        </div>
      </div>
     </Fragment>
  );
};

export default Contact;