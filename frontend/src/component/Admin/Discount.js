import React, { Fragment, useEffect, useState } from "react";
import "./Discount.css";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import TollIcon from "@mui/icons-material/Toll";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CodeIcon from "@mui/icons-material/Code";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  createDiscountCard,
  getAllDiscountCard,
} from "../../actions/userAction";
import Loader from "../layout/Loader/Loader";
import DiscountCard from "./DiscountCard";

const Discount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading: createDeleteLoading,
    message: createDeleteMessage,
    error: createDeleteError,
  } = useSelector((state) => state.createDeleteDiscountCard);

  const {
    loading: getAllDiscountCardLoading,
    discount,
    error: getAllDiscountCardError,
  } = useSelector((state) => state.getAllDiscountCard);

  console.log(discount);

  const [discountName, setDiscountName] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [value, setValue] = useState();
  const [coinsNeeded, setCoinsNeeded] = useState();

  const createDiscountCardForm = (e) => {
    e.preventDefault();
    if (
      discountName.trim() === "" ||
      value.trim() === "" ||
      coinsNeeded.trim() === ""
    ) {
      return toast.error("Fill Form Properly");
    }

    dispatch(
      createDiscountCard(discountName, discountCode, value, coinsNeeded)
    );
  };

  useEffect(() => {
    if (createDeleteMessage) {
      toast.success(createDeleteMessage);
      dispatch(clearErrors());
      setDiscountName("");
      setDiscountCode("");
      setValue();
      setCoinsNeeded();
      navigate("/admin/discount");
    }
    if (createDeleteError) {
      toast.error(createDeleteError);
      dispatch(clearErrors());
    }
    if (getAllDiscountCardError) {
      toast.error(getAllDiscountCardError);
      dispatch(clearErrors());
    }

    dispatch(getAllDiscountCard());
  }, [createDeleteMessage, createDeleteError, getAllDiscountCardError]);

  return (
    <Fragment>
      {createDeleteLoading || getAllDiscountCardLoading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Create Discount Card" />
          <div className="dashboard">
            <Sidebar />
            <div className="newCategoryContainer">
              <form
                className="createCategoryForm"
                encType="multipart/form-data"
                onSubmit={createDiscountCardForm}>
                <h1>Create Discount</h1>

                <div>
                  <SpellcheckIcon />
                  <input
                    type="text"
                    placeholder="Discount Card Name"
                    required
                    value={discountName}
                    onChange={(e) => setDiscountName(e.target.value)}
                  />
                </div>
                <div>
                  <CodeIcon />
                  <input
                    type="text"
                    placeholder="Discount Card Code"
                    required
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                </div>
                <div>
                  <TollIcon />
                  <input
                    type="number"
                    placeholder="Value Of Discount"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>

                <div>
                  <AttachMoneyIcon />
                  <input
                    type="number"
                    placeholder="Coins Needed To Redeem"
                    required
                    value={coinsNeeded}
                    onChange={(e) => setCoinsNeeded(e.target.value)}
                  />
                </div>

                <Button
                  id="createProductBtn"
                  type="submit"
                  //     disabled={loading ? true : false}
                >
                  Create Discount Card
                </Button>
              </form>
              <div className="discountHeading">
                <p>S. No</p>
                <p>Name</p>
                <p>Code</p>
                <p>Value</p>
                <p>Coins</p>
                <p>Used</p>
                <p>Action</p>
              </div>
              <div>
                {discount &&
                  discount.map((dis, i) => (
                    <div key={i}>
                      <DiscountCard id={i} data={dis} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Discount;
