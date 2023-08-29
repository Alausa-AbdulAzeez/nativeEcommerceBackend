var CryptoJS = require('crypto-js')
const User = require('../models/User')

// CREATE A USER
const createUser = async (req, res) => {
  const { username, email, location, password } = req?.body

  //   CHECK IF ALL REQUIRED PARAMETERS ARE PRESENT
  if (!username || !email || !location || !password) {
    res.status(400).json('Please fill in all required credentials.')
  }

  // CHECK IF THE EMAIL IS ALREADY BEING USED
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ error: 'Email address is already in use.' })
  }

  // HASH PASSWORD AND CONVERT TO STRING
  const hashedPassword = CryptoJS.AES.encrypt(
    password,
    process.env.CRYPTOJS_SECRET
  ).toString()

  //   CHECK IF THE PASWOORD HASH WAS SUCCESSFUL
  if (!hashedPassword) {
    res.status(500).json('An error occured, please try again')
  }

  //   IF PASSWORD HASHING AND ALL REQUIRED PARAMETERS ARE AVAILABLE, PROCEED WITH USER CREATION
  const newUser = { username, email, location, password: hashedPassword }

  // SAVE USER TO THE DB
  const savedUser = await User.save(newUser)

  //   CHECK IF THE USER WAS SUCCESSFULLY CREATED
  if (!savedUser) {
    res
      .status(500)
      .json('An error occured, and user could not be created please try again')
  }

  //   IF USER WAS CREATED AND SAVED SUCCESSFULLY, SEND THE RESPONSE WITHOUT THE PASSWORD
  let { password: userPassword, ...others } = newUser?._doc
  res.status(200).json({ ...others })

  try {
  } catch (error) {
    console.log(error)
    res.status(500).json('An error occured, please try again')
  }
}

// USER LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req?.body

    // CHECK IF ALL REQUIRED PARAMETERS ARE PRESENT
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Please provide email and password.' })
    }

    // FIND THE USER BY EMAIL
    const user = await User.findOne({ email })

    // CHECK IF THE USER EXISTS
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    // DECRYPT THE PASSWORD AND COMPARE
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTOJS_SECRET
    ).toString(CryptoJS.enc.Utf8)
    if (decryptedPassword !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    // GENERATE A JWT TOKEN
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    // RETURN THE JWT TOKEN IN THE RESPONSE
    const { password: userPassword, ...others } = user?._doc
    res.status(200).json({ ...others, token })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'An unexpected error occurred. Please try again.' })
  }
}

module.exports = { createUser, loginUser }
