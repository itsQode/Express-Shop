const express = require('express');

const UserContorller = require('../controllers/user');

const router = express.Router();

router.get(`/`, UserContorller.getAlluser);

router.get(`/:id`, UserContorller.getUserById);

router.get(`/get/count`, UserContorller.getUserCount);

router.put(`/:id`, UserContorller.updateUser);

router.post(`/`, UserContorller.createUser);

router.post(`/login`, UserContorller.login);

router.delete(`/:id`, UserContorller.deleteUserById);

module.exports = router;
