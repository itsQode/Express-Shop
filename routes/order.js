const express = require('express');

const router = express.Router();

const OrderController = require('../controllers/order');

router.get('/', OrderController.getAllOrder);

router.post('/', OrderController.createOrder);

module.exports = router;
