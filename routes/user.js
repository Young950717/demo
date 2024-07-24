const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, getByUsername, updateEmail, updatePassword, adminUpdateUser } = require('../controllers/userController'); 


// route api/user
router.route('/getAllUsers').get(getAllUsers);
router.route('/createUser').post(createUser);
// router.route('/updateUserEmail').put(createUser);
router.route('/getByUsername/:username').get(getByUsername);
router.route('/updateUserEmail/:username').put(updateEmail);
router.route('/updateUserPassword/:username').put(updatePassword);
router.route('/adminUpdateUser').put(adminUpdateUser);

module.exports = router
