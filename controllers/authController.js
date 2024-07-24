const User = require('../models/Users')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
// const crypto = require('crypto');

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { username, password } = req.body
  console.log('req.body')
  console.log(username)
  console.log(password)
  if (!username || !password) {
    res.status(400).json({
      success: false,
      message: 'Please enter email & Password'
    })
    // return next(new ErrorHandler('Please enter email & Password'), 400)
  }

  try {
    const user = await User.findUserByUsername()
    res.status(400).json({
      success: true,
      message: 'User found'
    })
  } catch (e) {
    res.status(500).json({ message: '自定义错误' })
  }
})
