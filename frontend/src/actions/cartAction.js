import {
  ADD_TO_CART,
  CLEAR_CART_ITEM,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";
import axios from "axios";

// Add to Cart
export const addItemsToCart =
  (product, quantity, user_id) => async (dispatch, getState) => {
    await axios.put(
      `/api/v1/product/addToCartIncrease/${product._id}/${user_id}`
    );

    dispatch({
      type: ADD_TO_CART,
      payload: {
        product: product._id,
        name: product.name,
        price: product.sellingPrice,
        image: product.images[0].url,
        stock: product.Stock,
        quantity,
      },
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  };

// REMOVE FROM CART
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// SAVE SHIPPING INFO
export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });

  localStorage.setItem("shippingInfo", JSON.stringify(data));
};

//CLEAR CART ITEMS
export const clearCartItems = () => async (dispatch, getState) => {
  dispatch({
    type: CLEAR_CART_ITEM,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};
