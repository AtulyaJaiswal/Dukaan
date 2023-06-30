import React, { Fragment, useEffect, useState } from "react";
import "./VendorDashboard.css";
import VendorSidebar from "./VendorSidebar";
import { Typography } from "@mui/material";
import MetaData from "../layout/MetaData";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  deleteProduct,
  getVendorProducts,
} from "../../actions/productAction";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProductCardVendor from "./ProductCardVendor";
import Loader from "../layout/Loader/Loader";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, products } = useSelector(
    (state) => state.vendorProducts
  );

  const [totalViews, setTotalViews] = useState(0);
  const [totalCarted, setTotalCarted] = useState(0);
  const [totalSold, setTotalSold] = useState(0);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    dispatch(getVendorProducts());
  }, [dispatch, toast, error]);

  useEffect(() => {
    var soldItems = 0,
      cartedItems = 0,
      viewsItems = 0;
    if (products) {
      for (let i = 0; i < products.length; i++) {
        soldItems += products[i].numberOfProductsSold;
        cartedItems += products[i].numberOfTimesAddedToCart;
        viewsItems += products[i].numberOfViews;
      }
    }
    setTotalViews(viewsItems);
    setTotalCarted(cartedItems);
    setTotalSold(soldItems);
  }, [products]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboardMain">
          <MetaData title={`Dashboard - Vendor`} />
          <VendorSidebar />
          <div className="dashboardContainer">
            <Typography component="h1"> Vendor Dashboard</Typography>
            <div className="dashboardSummary">
              <div className="dashboardSummaryBox2">
                <Link>
                  <p>Sales</p>
                  <p>{totalSold}</p>
                </Link>
                <Link>
                  <p>Carted</p>
                  <p>{totalCarted}</p>
                </Link>
                <Link>
                  <p>Views</p>
                  <p>{totalViews}</p>
                </Link>
              </div>
            </div>
            <div className="vendorDashboard">
              <div>
                {products && products.length === 0 && <h2>No Products</h2>}
              </div>
              <div>
                {products &&
                  products.map((product) => (
                    <div>
                      <ProductCardVendor product={product} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default VendorDashboard;
