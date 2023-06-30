import React, { Fragment } from "react";

const DiscountCard = ({ selectedDiscountCode, data }) => {
  return (
    <Fragment>
      <div className="discountHeading">
        <p>{data.code}</p>
        <p>{data.value}%</p>
        <p>{data.coinsNeededToRedeem}</p>
        <button
          onClick={(e) => selectedDiscountCode(data)}
          className="applyButton">
          Apply
        </button>
      </div>
    </Fragment>
  );
};

export default DiscountCard;
