import React from 'react';
// import playStore from "../../../images/playstore.png";
// import appStore from "../../../images/Appstore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src="https://play.google.com/about/howplayworks/static/assets/social/share_google_play_logo.png" 
             alt="PlayStore" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" 
             alt="AppStore" />
      </div>

      <div className="midFooter">
        <h1>E-COMMERCE</h1>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2021 &copy; Me</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="">Instagram</a>
        <a href="">Youtube</a>
        <a href="">Facebook</a>
        <a href="">Twitter</a>
      </div>
    </footer>
  )
}

export default Footer