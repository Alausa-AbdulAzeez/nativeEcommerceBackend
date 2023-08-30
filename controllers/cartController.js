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

// FUNCTION TO ADD PRODUCT TO CART
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
    } else {
      // IF PRODUCT AND USER EXISTS, CHECK IF THE PRODUCT TO BE ADDED ALREADY EXISTS IN THE CART

      // FIND CART
      const cart = await Cart.findOne({ userId })

      if (cart) {
        // IF USER HAS A CART, CHECK IF THE ITEM TO BE ADDED ALREADY EXISTS IN THE CART
        const existingProduct = cart?.products?.find(
          (product) => product?.cartItem?.toString() === cartItem
        )

        // IF PRODUCT TO BE ADDED ALREADY EXISTS IN THE CART
        if (existingProduct) {
          existingProduct.quantity += quantity
        } else {
          // IF PRODUCT TO BE ADDED DOES NOT ALREADY EXIST IN THE CART
          cart?.products?.push({ cartItem, quantity })
        }

        await cart.save()
        res.status(200).json({ message: 'Product added to cart', data: cart })
      } else {
        // CREATE A NEW CART INSTANCE IF THE USER'S CART IS EMPTY
        const newCart = new Cart({
          userId,
          products: [{ cartItem, quantity: quantity }],
        })

        await newCart.save()
        res.status(200).json('Product added to cart')
      }
    }
  } catch (error) {
    res.status(500).json('An unexpected error occurred. Please try again.')
  }
}
// END OF FUNCTION TO ADD PRODUCT TO CART

// FUNCTION TO REMOVE PRODUCT FROM CART
const removeFromCart = async (req, res) => {
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

    // IF PRODUCT AND USER EXISTS, CHECK IF THE PRODUCT TO BE REMOVED ALREADY EXISTS IN THE CART

    // FIND CART
    const cart = await Cart.findOne({ userId })

    if (cart) {
      // IF USER HAS A CART, CHECK IF THE ITEM TO BE REMOVED ALREADY EXISTS IN THE CART
      const existingProduct = cart?.products?.find(
        (product) => product?.cartItem?.toString() === cartItem
      )

      // IF PRODUCT TO BE REMOVED ALREADY EXISTS IN THE CART
      if (existingProduct) {
        if (existingProduct.quantity === 1) {
          await Cart.updateOne(
            { userId: userId },
            { $pull: { products: { cartItem } } }
          )
          res.status(200).json('Product removed from cart')
        } else {
          existingProduct.quantity -= 1
          await cart.save()
          res.status(200).json('Unit removed from cart')
        }
      } else {
        // IF PRODUCT TO BE REMOVED DOES NOT ALREADY EXIST IN THE CART
        res.status(404).json('Product not found')
      }
    } else {
      res.status(404).json('Cart not found')
    }
  } catch (error) {
    res.status(500).json('An unexpected error occurred. Please try again.')
  }
}
// END OF FUNCTION TO REMOVE PRODUCT FROM CART

// FUNCTION TO DELETE PRODUCT FROM CART
const deleteFromCart = async (req, res) => {
  try {
    // GET USERID FROM PARAMS
    const { cartId, userId, cartItemId } = req?.body

    // VALIDATE USERID
    if (!cartId || !userId || !cartItemId) {
      res
        .status(500)
        .json('Kindly confirm it cartID, cartItemId and userID are present')
    }

    // CHECK IF USER AND CART EXISTS
    const [cart, user] = await Promise.all([
      Cart.findOne({ userId }),
      User.findById(userId),
    ])

    if (!user || !cart) {
      return res.status(404).json({ error: 'User or Cart not found' })
    }

    // IF USER HAS A CART, CHECK IF THE ITEM TO BE REMOVED ALREADY EXISTS IN THE CART
    const existingProduct = cart?.products?.find((product) => {
      return product?.cartItem?.toString() === cartItemId
    })

    if (!existingProduct) {
      res.status(404).json('Product not found in the cart')
    } else {
      await Cart.updateOne(
        { userId: userId },
        { $pull: { products: { cartItem: cartItemId } } }
      )
      res.status(200).json('Product removed from cart')
    }
  } catch (error) {
    res.status(500).json('An unexpected error occurred. Please try again.')
  }
}
// END OF FUNCTION TO DELETE PRODUCT FROM CART

module.exports = { getCart, addToCart, removeFromCart, deleteFromCart }
