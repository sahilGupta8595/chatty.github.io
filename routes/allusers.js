const path = require("path");
const express = require("express");
const router = express.Router();
const getAllUsers = require('../controllers/getAllUsers');

// if the user is authenticated then only he can request on this path
router.get("/", getAllUsers);

module.exports = router;