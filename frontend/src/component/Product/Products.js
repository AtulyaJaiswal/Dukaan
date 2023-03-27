import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import Pagination from "../Pagination/Pagination";
import Slider from "@mui/material/Slider";
import { toast } from "react-toastify";
import Typography from "@mui/material/Typography";
import MetaData from "../layout/MetaData";
import { useParams } from "react-router-dom";

const categories = [
  "Mobiles & Accessories",
  "Computers & Accessories",
  "Electronics",
  "Home, Kitchen",
  "Men’s Fashion",
  "Women’s Fashion",
  "Sports, Fitness",
  "Books",
  "Industrial",
];

const Products = () => {

  const { keyW, page:pageNum } = useParams();
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

  const pageNumber = pageNum || 1;
  const [page, setPage] = useState(pageNumber);
  const [pages, setPages] = useState(totalPages);

  // console.log(totalPages);
  // console.log(resultPerPage);
  // console.log(productsCount);

  const keyword = keyW;

  // const setCurrentPageNo = (e) => {
  //   setCurrentPage(e);
  // };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  const filterElements = () => {
    dispatch(getProduct(keyword, page, price, category, ratings));
  }
  const removeFilterElements = () => {
    dispatch(getProduct());
  }
  // let count = pages;

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    // setPages(totalPages);

    dispatch(getProduct(keyword, page, price, category, ratings));
  }, [dispatch, error, page]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS" />
          <h2 className="productsHeading">Products</h2>

          <div className="products">
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
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
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