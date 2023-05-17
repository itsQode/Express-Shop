const express = require('express');

const router = express.Router();

const CategoryController = require('../controllers/category');

router.get('/', CategoryController.getAllCategory);

router.post('/', CategoryController.createCategory);

module.exports = router;
