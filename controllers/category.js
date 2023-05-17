const { Category } = require('../models/category');

class CategoryController {
  static async createCategory(req, res, next) {
    let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
      image: req.body.image,
    });

    category = await category.save();

    if (!category)
      return res.status(404).send({
        error: 'the category canot be created!',
        success: false,
        body: null,
      });

    res.send(category);
  }

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

  static async getCategoryById(req, res, next) {
    const id = req.params.id;
    if (!id) return;

    if (!mongoose.isValidObjectId(id))
      return res.status(200).json({
        error: 'invalid category id',
        success: false,
        body: null,
      });

    try {
      const category = await Category.findById(id);

      if (!category) {
        return res.status(404).json({
          error: 'category not found',
          success: false,
          body: null,
        });
      }

      return res.status(200).json({
        error: null,
        success: true,
        body: category,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'cant fetch category',
        success: false,
        body: null,
      });
    }
  }

  static async updateCategoryById(req, res, next) {
    const id = req.params.id;
    if (!id) return;

    if (!mongoose.isValidObjectId(id))
      return res.status(200).json({
        error: 'invalid category id',
        success: false,
        body: null,
      });

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        icon: req.body.icon || category.icon,
        color: req.body.color,
      },
      { new: true }
    );

    if (!category)
      return res.status(400).json({
        error: 'the category cannot be updated',
        success: false,
        body: null,
      });

    res.json({
      error: null,
      success: true,
      body: category,
    });
  }

  static async deleteCategory(req, res, next) {
    const id = req.params.id;
    if (!id) return;

    if (!mongoose.isValidObjectId(id))
      return res.status(200).json({
        error: 'invalid category id',
        success: false,
        body: null,
      });

    try {
      const category = await Category.findByIdAndRemove(id);
      if (!category) {
        return res.status(404).json({
          error: 'category not found',
          success: false,
          body: nulll,
        });
      }

      return res.status(200).json({
        error: null,
        success: true,
        body: 'category is deletd',
      });
    } catch (error) {
      return res.status(500).json({
        error,
        success: false,
        body: null,
      });
    }
  }
}

module.exports = CategoryController;
