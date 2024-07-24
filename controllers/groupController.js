// groupController.js

const Group = require('../models/Groups')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const checkGroupName = require('../utils/checkGroupName')

exports.getAllGroups = catchAsyncErrors(async (req, res) => {
  try {
    const groups = await Group.getAllGroups()
    return res.status(200).json({
      success: true,
      data: groups
    })
  } catch (e) {
    res.status(500).json({ message: '自定义错误' })
  }
})

exports.createGroup = catchAsyncErrors(async (req, res) => {
  try {
    const { groupname } = req.body
    checkGroupNameResult = checkGroupName(groupname)
    if (checkGroupNameResult.status == 400) {
      res.status(404).json({ message: checkGroupNameResult.message })
    }

    // to check why it returns list of groupname and not res json
    const getAllGroupsResults = await Group.getAllGroups()
    const exists = getAllGroupsResults.some(
      item => item.groupname === groupname
    )

    if (exists) {
      res.status(404).json({ message: checkGroupNameResult.message })
    }

    const newGroup = new Group({ groupname })
    const result = await newGroup.save()

    res.status(200).json({ message: 'Group created successfully' })
  } catch (error) {
    res.status(400).json({ message: error })
  }
})

exports.getGroupByUsername = catchAsyncErrors(async (req, res, next) => {
  const { username } = req.params
  const currentUser = new Group({ username })
  try {
    const user = await currentUser.getGroupByUsername()
    console.log(user)
    res.status(200).json({
      success: true,
      data: user
    })
  } catch (e) {
    res.status(500).json({ message: '自定义错误' })
  }
})

exports.addUserGroup = catchAsyncErrors(async (req, res) => {
  try {
    const { groups, username } = req.body
    const userGroup = new Group({ username })
    const getGroupByUsernameResult = await userGroup.getGroupByUsername()

    // delete from db if user remove it in frontend, but was in db previously
    for (let i = 0; i < getGroupByUsernameResult.length; i++) {
      const groupname = getGroupByUsernameResult[i].groupname
      if (!groups.includes(groupname)) {
        grouptoRemove = new Group({ groupname, username })
        removeGroup = await grouptoRemove.removeUserGroup()
      }
    }

    for (let i = 0; i < groups.length; i++) {
      const userGroup = new Group({ groupname: groups[i], username })
      console.log(groups[i])
      const result = await userGroup.addUserGroup()
    }
    res.status(200).json({ message: 'User Group added successfully' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error })
  }
})
