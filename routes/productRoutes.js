const express = require('express')
const router = express.Router()
const {
  createSingleProduct,
  getProducts,
} = require('../controllers/productControllers')

// CREATE SINGLE PRODUCT
router.post('/create', createSingleProduct)

// GET SINGLE/MULTIPLE PRODUCT(S)
router.get('/', getProducts)

module.exports = router
