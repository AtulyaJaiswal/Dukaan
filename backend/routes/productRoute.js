const express = require("express");
const {
  getAllProducts,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReview,
  deleteReview,
  createCategory,
  getAllCategory,
  addToCartIncrease,
  getVendorProducts,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/products").get(isAuthenticatedUser, getAdminProducts);
router.route("/vendor/products").get(isAuthenticatedUser, getVendorProducts);

router.route("/admin/product/new").post(isAuthenticatedUser, createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, updateProduct)
  .delete(isAuthenticatedUser, deleteProduct);

router.route("/product/:id/:user_id").get(getProductDetails);

router.route("/product/addToCartIncrease/:id/:user_id").put(addToCartIncrease);

router.route("/review").put(isAuthenticatedUser, createProductReview);
router
  .route("/reviews")
  .get(getProductReview)
  .delete(isAuthenticatedUser, deleteReview);

router
  .route("/admin/category/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createCategory);
router.route("/category").get(getAllCategory);

module.exports = router;
