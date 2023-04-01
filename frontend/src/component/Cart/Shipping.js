import React, { Fragment, useState, useEffect } from "react";
import "./Shipping.css";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingInfo } from "../../actions/cartAction";
import MetaData from "../layout/MetaData";
import PinDropIcon from "@mui/icons-material/PinDrop";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PublicIcon from "@mui/icons-material/Public";
import PhoneIcon from "@mui/icons-material/Phone";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import { Country, State } from "country-state-city";
import { toast } from "react-toastify";
import CheckoutSteps from "../Cart/CheckoutSteps";
import KeyIcon from '@mui/icons-material/Key';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../layout/Loader/Loader";
import { verifyPhone } from "../../firebase";

const Shipping = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shippingInfo } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);

  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [state, setState] = useState(shippingInfo.state);
  const [country, setCountry] = useState("IN");
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
  const [otp, setOtp] = useState();
  const [otpButton, setOtpButton] = useState(true);
  const [verifyPinCode, setVerifyPinCode] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [loading,setLoading] = useState(false);
  const [otpObj, setOtpObj] = useState("");

  const shippingSubmit = (e) => {
    e.preventDefault();

    if (phoneNo.length < 10 || phoneNo.length > 10) {
      toast.error("Phone Number should be 10 digits Long");
      return;
    }
    if(state===""){
      toast.error("Select State");
    }
    dispatch(
      saveShippingInfo({ address, city, state, country, pinCode, phoneNo })
    );
    navigate("/order/confirm");
  };

  const verifyPinCodeEntry = (e) => {
    e.preventDefault();
    if(pinCode.length!==6 || pinCode.trim==="") toast.error("Enter Pin Code properly");
    setLoading(true);
    axios.get(`https://api.postalpincode.in/pincode/${pinCode}`)
      .then((result) => {
        setLoading(false);
        if(result.data[0].Status==="Success"){
          toast.success("Pin Code Verified");
          setVerifyPinCode(true);
        }
        else toast.error("Invalid Pin Code");
    });
  };

  const sendOtpMobile = async (e) => {
    e.preventDefault();

    if(phoneNo.trim==="" || phoneNo===undefined || phoneNo.length!==10){
      return toast.error("Enter a proper phone number");
    }
    else{
        try {
            toast.success("Sending OTP, please wait");
            const response = await verifyPhone("+91"+phoneNo);
            setOtpButton(false);
            setOtpObj(response);
        } catch (error) {
            toast.error("Not able to send otp. Please reload the page and try again.");
            // setLoading(false);
            console.log(error);
        }
    }
  }

  const verifyOtpMobile = async (e) => {
    e.preventDefault();

    if(otp.trim()==="" || otp==null){
        return toast.error("Fill the OTP field properly OTP");
    }
    try{
        await otpObj.confirm(otp);
        setVerifyOtp(true);
        toast.success("OTP verified successfully")
    }catch(err){
        toast.error("Wrong OTP");
    }
  };

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
    <Fragment>
      <MetaData title="Shipping Details" />

      <CheckoutSteps activeStep={0} />

      <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Shipping Details</h2>

          <div className="shippingForm">
            <div>
              {/* NEW IMPORTANT CONCEPT */}

              <PublicIcon />

              <select
                required
                disabled={true}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Country</option>
                {Country &&
                  Country.getAllCountries().map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            {country && (
              <div>
                <TransferWithinAStationIcon />

                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">State</option>
                  {State &&
                    State.getStatesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div>
              <PinDropIcon />
              <input
                type="number"
                placeholder="Pin Code"
                required
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>
            <button onClick={verifyPinCodeEntry} className="shippingBtn">Verify Pin Code</button>

            <div>
              <PhoneIcon />
              <input
                placeholder="Phone Number"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                size="10"
              />
            </div>
            <button 
              onClick={sendOtpMobile} 
              disabled={!otpButton}
              className={otpButton ? "shippingBtn" : "shippingBtnDisable"}
              >Send OTP</button>
            <div>
              <KeyIcon style={verifyOtp ? {display:"none"} : {display:"block"}} />
                <input
                  type="number"
                  placeholder="Enter OTP"
                  style={verifyOtp ? {display:"none"} : {display:"block"}}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
            </div>
            <button 
              onClick={verifyOtpMobile} 
              className="shippingBtn"
              style={verifyOtp ? {display:"none"} : {display:"block"}}
              >Verify OTP</button>

            <div>
              <HomeIcon />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <LocationCityIcon />
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <button
              className={verifyOtp && verifyPinCode ? "shippingBtn" : "shippingBtnDisable"}
              disabled={verifyOtp===false || verifyPinCode===false} //|| krna hai
              onClick={shippingSubmit}
            >
            Continue
            </button>
          </div>
          <div id="sign-in-phone-number"/>
        </div>
      </div>
    </Fragment>
    )}
    </Fragment>
  );
};

export default Shipping;