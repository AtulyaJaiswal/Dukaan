const express = require('express');
const { getAllProducts, 
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
    } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles} = require('../middleware/auth');

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/products").get( (isAuthenticatedUser), authorizeRoles("admin"), getAdminProducts);

router.route("/admin/product/new").post((isAuthenticatedUser), authorizeRoles("admin"), createProduct);

router.route("/admin/product/:id")
    .put((isAuthenticatedUser), authorizeRoles("admin"), updateProduct)
    .delete((isAuthenticatedUser), authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put((isAuthenticatedUser), createProductReview);
router.route("/reviews")
    .get(getProductReview)
    .delete((isAuthenticatedUser), deleteReview);

router.route("/admin/category/new").post((isAuthenticatedUser), authorizeRoles("admin"), createCategory);
router.route("/category").get(getAllCategory);

module.exports = router; 