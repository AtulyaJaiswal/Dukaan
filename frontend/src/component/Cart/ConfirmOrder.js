import React, { Fragment, useEffect, useState } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import "./ConfirmOrder.css";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { createOrder } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { clearErrors, getAllDiscountCard } from "../../actions/userAction";
import { clearCartItems } from "../../actions/cartAction";
import DiscountCard from "./DiscountCard";
import { toast } from "react-toastify";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { loading, message } = useSelector((state) => state.newOrder);
  const {
    loading: getAllDiscountCardLoading,
    discount,
    error: getAllDiscountCardError,
  } = useSelector((state) => state.getAllDiscountCard);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 200;

  const totalPrice = subtotal + shippingCharges;

  const coins = Math.floor(subtotal / 100);

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const [finalPrice, setFinalPrice] = useState(totalPrice);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [redeemedCoins, setRedeemedCoins] = useState(0);

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: subtotal,
    taxPrice: 0,
    shippingPrice: shippingCharges,
    totalPrice: totalPrice,
    coinsUsed: redeemedCoins,
  };

  order.paymentInfo = {
    id: "123qwerty456uiop7890",
    status: "succeeded",
  };

  const proceedToPayment = () => {
    // const data = {
    //   subtotal,
    //   shippingCharges,
    //   totalPrice,
    // };

    // sessionStorage.setItem("orderInfo", JSON.stringify(data))

    order.totalPrice = finalPrice;
    order.coinsUsed = redeemedCoins;
    dispatch(createOrder(order));

    // navigate("/success");

    // navigate("/process/payment");
  };

  const removeDiscountPercentage = () => {
    setDiscountPercentage(0);
    setFinalPrice(subtotal + shippingCharges);
    toast.error("Discount Code Removed");
  };

  const selectedDiscountCode = (disCode) => {
    if (user.coins < disCode.coinsNeededToRedeem) {
      return toast.error("Not Sufficient Coins");
    }
    setDiscountPercentage(disCode.value);
    setRedeemedCoins(disCode.coinsNeededToRedeem);
    var finalDiscount = (disCode.value / 100) * subtotal;
    setFinalPrice(subtotal - finalDiscount + shippingCharges);
    toast.success(`Coupon Code ${disCode.code} applied`);
  };

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
    if (message) {
      // localStorage.removeItem("cartItems");
      dispatch(clearErrors());
      dispatch(clearCartItems());
      navigate("/success");
    }
  }, [navigate, isAuthenticated, message]);

  useEffect(() => {
    dispatch(getAllDiscountCard());
  }, []);

  return (
    <Fragment>
      {loading || getAllDiscountCardLoading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Confirm Order" />
          <CheckoutSteps activeStep={1} />
          <div className="confirmOrderPage">
            <div>
              <div className="confirmShippingArea">
                <Typography>Shipping Info</Typography>
                <div className="confirmShippingAreaBox">
                  <div>
                    <p>Name:</p>
                    <span>{user.name}</span>
                  </div>
                  <div>
                    <p>Coins:</p>
                    <span>{user.coins}</span>
                  </div>
                  <div>
                    <p>Phone:</p>
                    <span>{shippingInfo.phoneNo}</span>
                  </div>
                  <div>
                    <p>Address:</p>
                    <span>{address}</span>
                  </div>
                </div>
              </div>
              <div className="confirmCartItems">
                <Typography>Your Cart Items:</Typography>
                <div className="confirmCartItemsContainer">
                  {cartItems &&
                    cartItems.map((item) => (
                      <div key={item.product}>
                        <img src={item.image} alt="Product" />
                        <Link to={`/product/${item.product}`}>
                          {item.name}
                        </Link>{" "}
                        <span>
                          {item.quantity} X ₹{item.price} ={" "}
                          <b>₹{item.price * item.quantity}</b>
                        </span>
                      </div>
                    ))}
                </div>
                <div className="coupons">
                  <p>
                    <h2>Coupons</h2> (Can only be applied one at a time)
                  </p>
                  <div className="discountHeading">
                    <p style={{ fontWeight: "700" }}>Code</p>
                    <p style={{ fontWeight: "700" }}>Value</p>
                    <p style={{ fontWeight: "700" }}>Coins</p>
                    <p style={{ fontWeight: "700" }}>Actions</p>
                  </div>
                  {discount &&
                    discount.map((dis, i) => (
                      <div key={i}>
                        <DiscountCard
                          selectedDiscountCode={selectedDiscountCode}
                          data={dis}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
            {/*  */}
            <div>
              <div className="orderSummary">
                <Typography>Order Summary</Typography>
                <div>
                  <div>
                    <p>Subtotal:</p>
                    <span>₹{subtotal}</span>
                  </div>
                  <div>
                    <p>Shipping Charges:</p>
                    <span>₹{shippingCharges}</span>
                  </div>
                  <div>
                    <p>Discount:</p>
                    <span>{discountPercentage}%</span>
                  </div>
                </div>

                <div className="orderSummaryTotal">
                  <p>
                    <b>Total:</b>
                  </p>
                  <span>₹{finalPrice}</span>
                </div>

                <button onClick={proceedToPayment}>Proceed To Payment</button>

                <div className="coins">
                  <p>You will earn {coins} coins on this order</p>
                </div>
                <button
                  className="removeDiscount"
                  onClick={removeDiscountPercentage}>
                  Remove Discount Code
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ConfirmOrder;
