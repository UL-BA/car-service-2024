const express = require('express');
const { createOrUpdateUser, verifyToken } = require('./user.controller');
const router = express.Router();

router.post('/create-user', verifyToken, createOrUpdateUser);

module.exports = router;