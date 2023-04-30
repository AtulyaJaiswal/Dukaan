import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getCategory, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import Pagination from "../Pagination/Pagination";
import Slider from "@mui/material/Slider";
import { toast } from "react-toastify";
import Typography from "@mui/material/Typography";
import MetaData from "../layout/MetaData";
import { useParams } from "react-router-dom";
// import { profileReducer } from "../../reducers/userReducer";

const Products = () => {

  const { keyword } = useParams();
  const dispatch = useDispatch();

  const [price, setPrice] = useState([0, 100000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);

  const {
    products,
    loading,
    error,
    // productsCount,
    // resultPerPage,
    pages: totalPages,
  } = useSelector((state) => state.products);
  const {loading: categoryLoading, category: categoriesName, error: categoryError} = useSelector((state) => state.category);

  const pageNumber = 1;
  const [page, setPage] = useState(pageNumber);
  const [pages, setPages] = useState(totalPages);

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  const filterElements = () => {
    dispatch(getProduct(keyword, 1, price, category, ratings));
  }
  const removeFilterElements = () => {
    //category hatt nii raa
    dispatch(getProduct());
  }

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if(categoryError){
      toast.error(categoryError);
      dispatch(clearErrors());
    }
    
    dispatch(getProduct(keyword, page, price,category, ratings));
    dispatch(getCategory());
  }, [dispatch, error, page, keyword, categoryError]);

  useEffect(() => {
    setPages(totalPages);
  }, [totalPages]);

  return (
    <Fragment>
      {loading || categoryLoading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS" />
          <h2 className="productsHeading">Products</h2>

          <div className="products">
            {(products.length===0) && 
            <div className="noProductsFound">
                <h4>No Products Found</h4>
            </div>}
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>

          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={100000}
            />

            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categoriesName && categoriesName.map((category) => (
                <li
                  className="category-link"
                  key={category.categoryName}
                  onClick={() => setCategory(category.categoryName)}
                >
                  {category.categoryName}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography style={{fontSize:"1vmax"}} component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
            <div>
              <button onClick={filterElements}>Filter</button>
            </div>
            <div>
              <button onClick={removeFilterElements}>Remove Filter</button>
            </div>
          </div>
          {/* {resultPerPage < count && ( */}
            <div className="paginationBox">
              <Pagination 
                page={page} 
                pages={pages} 
                changePage={setPage} 
              />
            </div>
          {/* )} */}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;