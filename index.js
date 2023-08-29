const express = require('express')
const cors = require('cors')
const { default: mongoose } = require('mongoose')
const productRoutes = require('./routes/productRoutes')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const cartRoutes = require('./routes/cartRoutes')

const app = express()
const dotenv = require('dotenv')
app.use(cors())

// CONFIGS
dotenv.config()
app.use(express.json())
const port = 3000 || process.env.PORT

// ROUTES
app.use('/api/product/', productRoutes)
app.use('/api/auth/', authRoutes)
app.use('/api/user/', userRoutes)
app.use('/api/cart/', cartRoutes)

// DB CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(
    app.listen(port, () =>
      console.log(`DB connection successful, app running on port ${port}!`)
    )
  )
  .catch((err) => console.log(err))
