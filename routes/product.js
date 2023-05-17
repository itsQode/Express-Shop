const express = require('express');

const ProductContorller = require('../controllers/product');

const router = express.Router();

router.get(`/`, ProductContorller.getAllProduct);

router.get(`/:id`, ProductContorller.getProductById);

router.get(`/get/count`, ProductContorller.getProductCount);

router.get(`/get/featured/:count`, ProductContorller.getFeaturedProducts);

router.post(`/`, ProductContorller.createProduct);

router.put(`/:id`, ProductContorller.updateProductById);

router.delete(`/:id`, ProductContorller.deleteProductById);

module.exports = router;
