const express = require('express');

const ProductContorller = require('../controllers/product');

const router = express.Router();

router.get(`/`, ProductContorller.getAllProduct);

router.post(`/`, ProductContorller.createProduct);

module.exports = router;
