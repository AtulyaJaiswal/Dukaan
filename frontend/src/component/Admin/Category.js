import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import {
  clearErrors,
  createCategory,
  getCategory,
} from "../../actions/productAction";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Profile from "../../Images/Profile.png";
import "./Category.css";

const Category = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, message, error } = useSelector(
    (state) => state.newProductCategory
  );

  const {
    loading: detailsLoading,
    category,
    error: detailsError,
  } = useSelector((state) => state.category);

  const [categoryName, setCategoryName] = useState("");
  const [photoCategory, setImages] = useState("");
  const [imagesPreview, setImagesPreview] = useState(Profile);

  const createCategorySubmitHandler = (e) => {
    e.preventDefault();
    if (categoryName.trim() === "") return toast.error("Enter Category Name");

    dispatch(createCategory(categoryName.trim(), photoCategory));
  };

  const createProductImagesChange = (e) => {
    e.preventDefault();

    setImages("");
    setImagesPreview("");

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagesPreview(reader.result);
        setImages(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (detailsError) {
      toast.error(detailsError);
      dispatch(clearErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(clearErrors());
      navigate("/admin/category");
    }

    dispatch(getCategory());
  }, [error, detailsError, message, dispatch, navigate]);

  return (
    <Fragment>
      {loading || detailsLoading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Create Category" />
          <div className="categoryDashboard">
            <Sidebar />
            <div className="newCategoryContainer">
              <form
                className="createCategoryForm"
                encType="multipart/form-data"
                onSubmit={createCategorySubmitHandler}>
                <h1>Create Category</h1>

                <div>
                  <SpellcheckIcon />
                  <input
                    type="text"
                    placeholder="Category Name"
                    required
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </div>

                <div id="createProductFormFile">
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={createProductImagesChange}
                  />
                </div>

                <div id="createCategoryFormImage">
                  <img src={imagesPreview} alt="Product Preview" />
                </div>

                <Button
                  id="createProductBtn"
                  type="submit"
                  disabled={loading ? true : false}>
                  Create Category
                </Button>
              </form>
              <div className="categoryHeading">
                <h4>S. No</h4>
                <h4>Photo</h4>
                <h4>Category Name</h4>
              </div>
              <div className="categoryDetailsBox">
                {category &&
                  category.map((cat, i) => (
                    <div key={i} className="categoryDetails">
                      <h3>{i + 1}</h3>
                      <img src={cat.photoCategory.url} alt="Category" />
                      <p>{cat.categoryName}</p>
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

export default Category;
