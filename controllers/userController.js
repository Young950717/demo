// userController.js

const User = require('../models/Users')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const checkPassword = require('../utils/checkPassword')
const checkUsername = require('../utils/checkUsername')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { testErrorInfo } = require('../model/ErrorInfo')
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  console.log(User)
  try {
    const users = await User.getAllUsers()
    console.log('users')
    console.log(users)
    for (const user in users) {
    }
    res.send(new SuccessModel(users))
  } catch (e) {
    res.send(new ErrorModel(testErrorInfo))
  }
})

exports.getByUsername = catchAsyncErrors(async (req, res, next) => {
  const { username } = req.params
  const currentUser = new User({ username })
  try {
    const user = await currentUser.getByUsername()
    res.send(new SuccessModel(user))
  } catch (e) {
    res.send(new ErrorModel(testErrorInfo))
  }
})

exports.createUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { username, password, email, disabledNum } = req.body
    const disabled = disabledNum ? 0 : 1

    checkUsernameResult = checkUsername(username)

    if (checkUsernameResult.status == 400) {
      return res.status(404).json({ message: checkUsernameResult.message })
    }

    checkPasswordResult = checkPassword(password)

    if (checkPasswordResult.status == 400) {
      return res.status(404).json({ message: checkPasswordResult.message })
    }

    const newUser = new User({ username, password, email, disabled })
    const result = await newUser.save()
    console.log(result)

    return res.status(200).json({ message: 'User created successfully' })
  } catch (error) {
    console.error('Error in user controller:', error)
    return res.status(500).json({ message: error })
  }
})

exports.adminUpdateUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { username, password, email, disabled } = req.body

    checkPasswordResult = checkPassword(password)

    if (checkPasswordResult.status == 400) {
      res.status(404).json({ message: checkPasswordResult.message })
    }

    const updateUser = new User({ username, password, email, disabled })
    console.log(updateUser)

    // Save the new user to the database
    const result = await updateUser.adminUpdateUser()
    console.log(result)

    res.status(200).json({ message: 'User updated successfully' })
  } catch (error) {
    console.error('Error in user controller:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

exports.updateEmail = catchAsyncErrors(async (req, res, next) => {
  try {
    const { username } = req.params
    const { email } = req.body
    console.log(username)
    console.log(email)

    const numRowsAffected = await User.updateEmail(username, email)

    if (numRowsAffected === 0) {
      res.status(404).json({ error: 'User not found or no changes made' })
    }
    res.status(200).json({
      success: true,
      message: 'Email updated successfully'
    })
  } catch (error) {
    console.error('Error updating email:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  try {
    const { username } = req.params
    const { password } = req.body
    checkPasswordResult = checkPassword(password)

    if (checkPasswordResult.status == 400) {
      res.status(404).json({ message: checkPasswordResult.message })
    }

    const numRowsAffected = await User.updateEmail(username, password)

    if (numRowsAffected === 0) {
      res.status(404).json({ error: 'User not found or no changes made' })
    }

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    })
  } catch (error) {
    console.error('Error updating password:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})
