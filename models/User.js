const { default: mongoose } = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please the username field is required'],
    },
    email: {
      type: String,
      required: [true, 'Please the email field is required'],
    },
    password: {
      type: String,
      required: [true, 'Please the password field is required'],
    },
    location: {
      type: String,
      required: [true, 'Please the location field is required'],
      default: 'Shanghai, China',
    },
  },
  { timestamps: true }
)

const User = mongoose.model('User', UserSchema)
module.exports = User
