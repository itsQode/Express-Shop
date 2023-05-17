const { Category } = require('../models/category');

class CategoryController {
  static async getAllCategory(req, res, next) {
    const categoryList = await Category.find();

    if (!categoryList) {
      return res.status(500).json({
        error: 'Cant fetch Category list',
        success: false,
        body: null,
      });
    }

    res.status(200).json({
      error: null,
      success: true,
      body: categoryList,
    });
  }

  static async createCategory(req, res, next) {
    const category = new Category({
      name: req.body.name,
      image: req.body.image,
    });

    product
      .save()
      .then((createdCategory) => {
        return res.status(201).json({
          error: null,
          success: true,
          body: createdCategory,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          error,
          success: false,
          body: null,
        });
      });
  }
}

module.exports = CategoryController;
