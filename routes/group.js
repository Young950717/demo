const express = require('express');
const router = express.Router();

const { getAllGroups, createGroup, addUserGroup, getGroupByUsername } = require('../controllers/groupController'); 

// route api/group
router.route('/getAllGroups').get(getAllGroups);
router.route('/createGroup').post(createGroup);
router.route('/addUserGroup').post(addUserGroup);
router.route('/getGroupByUsername/:username').get(getGroupByUsername);

module.exports = router
