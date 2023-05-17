const express = require('express');

const UserContorller = require('../controllers/user');

const router = express.Router();

router.get(`/`, UserContorller.getAlluser);

router.post(`/`, UserContorller.createUser);

module.exports = router;
