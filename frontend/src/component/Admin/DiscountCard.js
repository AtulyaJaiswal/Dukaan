import React, { Fragment } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Discount.css";
import { deleteDiscountCard } from "../../actions/userAction";
import { useDispatch } from "react-redux";

const DiscountCard = ({ id, data }) => {
  const dispatch = useDispatch();

  const deleteDiscountCardWithID = () => {
    dispatch(deleteDiscountCard(data._id));
  };

  return (
    <Fragment>
      <div className="discountHeading">
        <p>{id + 1}</p>
        <p>{data.name}</p>
        <p>{data.code}</p>
        <p>{data.value}%</p>
        <p>{data.coinsNeededToRedeem}</p>
        <p>{data.numberOfTimesUsed}</p>
        <DeleteIcon onClick={deleteDiscountCardWithID} />
      </div>
    </Fragment>
  );
};

export default DiscountCard;
