const Product = require('../models/Product')

// CREATE A PRODUCT
const createSingleProduct = async (req, res) => {
  const { title, supplier, imageUrl, description, product_location, price } =
    req.body
  try {
    // Check if title all parameters are provided
    if (
      !title ||
      !supplier ||
      !imageUrl ||
      !description ||
      !product_location ||
      !price
    ) {
      return res
        .status(400)
        .json({ message: 'Please fill in all required details' })
    }

    //   PROCEED IF ALL DETAILS ARE AVAILABLE

    // CREATE THE PRODUCT VARIABLE
    const product = {
      title,
      supplier,
      imageUrl,
      description,
      product_location,
      price,
    }

    // SAVE TO THE DB
    const newProduct = await Product.create(product)

    // CHECK IF PRODUCT WASN'T SAVED SUCCESSFULLY
    if (!newProduct) {
      res
        .status(400)
        .json({ message: 'Could not create product, please try again.' })
    }

    // IF PRODUCT WASN SAVED SUCCESSFULLY
    res.status(201).json(newProduct)

    // RESPONSE
  } catch (error) {
    res.status(500).json(error)
  }
}

// GET ALL/SINGLE PRODUCT(S)
const getProducts = async (req, res) => {
  // CHECK IF A "productId" query was passed
  const { productId } = req.query

  try {
    if (req.query?.productId) {
      //  If "productId" query was passed
      const foundProduct = await Product.findById(productId)

      //   IF PRODUCT WAS NOT FOUND
      if (!foundProduct) {
        res.status(404).json({ message: 'Product not found' })
      }

      // IF PRODUCT WAS FOUND
      res.status(200).json(foundProduct)
    } else {
      //  If "productId" params was not passed
      const products = await Product.find().sort({ createdAt: -1 })

      //   IF PRODUCTS WERE NOT FOUND
      if (!products || products.length === 0) {
        res.status(404).json({ message: 'Products not found' })
      }

      // IF PRODUCT WAS FOUND
      res.status(200).json(products)
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

// PRODUCT SEARCH
const productsSearch = async (req, res) => {
  const searchQuery = req.query?.key

  try {
    // CHECK IF A QUERY WAS PASSED
    if (searchQuery) {
      const result = await Product.aggregate([
        {
          $search: {
            index: 'furniture',
            text: {
              query: searchQuery,
              path: {
                wildcard: '*',
              },
            },
          },
        },
      ])

      //   IF PRODUCTS WERE NOT FOUND
      if (!result || result.length === 0) {
        res.status(404).json({ message: 'Products not found' })
      }

      //   IF PRODUCTS WERE FOUND
      res.status(200).json(result)
    } else {
      res.status(400).json({ message: 'Please pass in a value' })
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

module.exports = { createSingleProduct, getProducts, productsSearch }
