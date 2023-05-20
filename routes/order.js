const express = require('express');

const router = express.Router();

const OrderController = require('../controllers/order');

router.get('/', OrderController.getAllOrder);

router.get('/:id', OrderController.getOrderById);

router.get('/get/totalsales', OrderController.getTotalSales);

router.get('/get/userorders/:userid', OrderController.getUserOrderList);

router.put('/:id', OrderController.updateCategoryById);

router.post('/', OrderController.createOrder);

router.delete('/:id', OrderController.deleteOrderById);

module.exports = router;
