const express = require("express");
const router = express.Router();
const {
  createSingleProduct,
  getProducts,
  productsSearch,
} = require("../controllers/productControllers");

// CREATE SINGLE PRODUCT
router.post("/create", createSingleProduct);

// GET SINGLE/MULTIPLE PRODUCT(S)
router.get("/", getProducts);

// SEARCH FOR PRODUCT(S)
router.get("/search", productsSearch);

module.exports = router;
