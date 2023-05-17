const express = require('express');

const router = express.Router();

const CategoryController = require('../controllers/category');

router.post('/', CategoryController.createCategory);

router.get('/', CategoryController.getAllCategory);

router.get('/:id', CategoryController.getCategoryById);

router.put('/:id', CategoryController.updateCategoryById);

router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;
