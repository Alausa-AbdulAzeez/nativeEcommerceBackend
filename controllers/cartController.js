const Product = require('../models/Product')
const User = require('../models/User')
const Cart = require('../models/cart')

// FUNCTION TO GET CART
const getCart = async (req, res) => {
  try {
    // GET USERID FROM PARAMS
    const { userId } = req?.query

    // VALIDATE USERID
    if (!userId) {
      res.status(500).json('User ID field cannot be empty')
    }

    // FIND USER
    const user = await User.findById(userId)

    // CHECK IF USER EXISTS
    if (!user) {
      res.status(400).json('User not found')
    }

    // FIND CART
    const cart = await Cart.find({ userId })

    res.status(200).json(cart)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An unexpected error occurred. Please try again.' })
  }
}
// END OF FUNCTION TO GET CART

const addToCart = async (req, res) => {
  try {
    // DESTRUCTURE REQUIRED VALUES FROM REQ.BODY
    const { userId, cartItem, quantity } = req?.body

    // VALIDATE REQUIRED VALUES
    if (!userId || !cartItem) {
      res.status(400).json('Please pass all required details')
    }

    // FIND USER
    const user = await User.findById(userId)

    // CHECK IF USER EXISTS
    if (!user) {
      res.status(404).json('User not found')
    }

    // CHECK IF PRODUCT EXISTS
    const foundProduct = await Product.findOne({ _id: cartItem })

    //   IF PRODUCT WAS NOT FOUND
    if (!foundProduct) {
      res.status(404).json('Product not found')
    }

    // IF PRODUCT AND USER EXISTS, CHECK IF THE PRODUCT TO BE ADDED ALREADY EXISTS IN THE CART

    // FIND CART
    const cart = await Cart.findOne({ userId })

    if (cart) {
      // IF USER HAS A CART, CHECK IF THE ITEM TO BE ADDED ALREADY EXISTS IN THE CART
      const existingProduct = cart?.products?.find(
        (product) => product?.cartItem?.toString() === cartItem
      )

      if (existingProduct) {
        existingProduct.quantity += quantity
      } else {
        cart?.products?.push({ cartItem, quantity })
      }

      await cart.save()
      res.status(200).json({ message: 'Product added to cart', data: cart })
    } else {
      const newCart = new Cart({
        userId,
        products: [{ cartItem, quantity: quantity }],
      })

      await newCart.save()
      res.status(200).json('Product added to cart')
    }
  } catch (error) {
    res.status(500).json('An unexpected error occurred. Please try again.')
  }
}

module.exports = { getCart, addToCart }
