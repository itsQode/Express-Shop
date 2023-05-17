const { Product } = require('../models/product');

class ProductContorller {
  static async getAllProduct(req, res, next) {
    const productList = await Product.find();

    if (!productList) {
      return res.status(500).json({
        error: 'Cant fetch product list',
        success: false,
        body: null,
      });
    }

    res.status(200).json({
      error: null,
      success: true,
      body: productList,
    });
  }

  static async createProduct(req, res, next) {
    const product = new Product({
      name: req.body.name,
      image: req.body.image,
      countInStock: req.body.countInStock,
    });

    product
      .save()
      .then((createdProduct) => {
        return res.status(201).json({
          error: null,
          success: true,
          body: createdProduct,
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

module.exports = ProductContorller;
