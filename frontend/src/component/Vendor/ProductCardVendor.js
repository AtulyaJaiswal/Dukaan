import React, { Fragment } from "react";
import "./ProductCardVendor.css";

const ProductCardVendor = ({ product }) => {
  console.log(product);
  return (
    <Fragment>
      <div className="vendorProductList">
        <div>
          <img src={product.images[0].url} />
        </div>
        <div>
          <p>
            {product.name} - {product._id}
          </p>
          <p>
            <span>Number of reviews -</span> <p>{product.numOFReviews}</p>
          </p>
          <p>
            <span>Number of views -</span> <p>{product.numberOfViews}</p>
          </p>
          <p>
            <span>Number of times added to cart - </span>{" "}
            <p>{product.numberOfTimesAddedToCart}</p>
          </p>
          <p>
            <span>Number of times sold - </span>{" "}
            <p>{product.numberOfProductsSold}</p>
          </p>
        </div>
      </div>
      <hr></hr>
    </Fragment>
  );
};

export default ProductCardVendor;
