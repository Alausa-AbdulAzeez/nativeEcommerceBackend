const User = require('../models/User')

const deleteUser = async (req, res) => {
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
      res.status(404).json('User not found')
    }

    // IF USERID EXISTS, FIND AND DELETE THE USER
    await User.findByIdAndDelete(userId)

    res.status(200).json('User successfully deleted')
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An unexpected error occurred. Please try again.' })
  }
}

const getUser = async (req, res) => {
  try {
    // GET USERID FROM PARAMS
    const { userId } = req?.query

    // VALIDATE USERID
    if (!userId) {
      res.status(500).json('User ID field cannot be empty')
    }

    const user = await User.findById(userId)

    // CHECK IF USER EXISTS
    if (!user) {
      res.status(404).json('User not found')
    }

    // IF USER EXISTS, RETURN RESULT
    const { password, ...others } = user?._doc
    res.status(200).json({ ...others })
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An unexpected error occurred. Please try again.' })
  }
}

module.exports = { deleteUser, getUser }
