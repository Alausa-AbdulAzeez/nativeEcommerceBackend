const express = require('express')
const { getUser, deleteUser } = require('../controllers/userController')

const router = express.Router()

router.get('/getUser', getUser)
router.delete('/deleteUser', deleteUser)

module.exports = router
