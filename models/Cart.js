const { default: mongoose } = require('mongoose')

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        cartItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
)

// EXPORT MODEL
const Cart = mongoose.model('Cart', CartSchema)
module.exports = Cart
