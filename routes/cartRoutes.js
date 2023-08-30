const express = require('express')
const {
  getCart,
  addToCart,
  removeFromCart,
  deleteFromCart,
} = require('../controllers/cartController')

const router = express.Router()

router.get('/', getCart)
router.post('/addToCart', addToCart)
router.post('/removeFromCart', removeFromCart)
router.post('/deleteFromCart', deleteFromCart)

module.exports = router
