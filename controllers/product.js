const { Product } = require('../models/product');
const { Category } = require('../models/category');
const mongoose = require('mongoose');

class ProductContorller {
  static async createProduct(req, res, next) {
    const id = req.body.category;

    if (!mongoose.isValidObjectId(id))
      return res.status(404).json({
        error: 'invalid category id',
        success: false,
        body: null,
      });

    const category = await Category.findById(req.body.category);

    const file = req.file;
    if (!file)
      return res.status(400).json({
        error: 'No image in the request',
        success: false,
        body: null,
      });

    if (!category)
      return res.status(404).json({
        error: 'Invalid category',
        success: false,
        body: null,
      });

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${basePath}${fileName}`,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });

    product = await product.save();

    if (!product)
      return res.status(500).json({
        error: 'The product cannot be created',
        success: false,
        body: null,
      });

    return res.status(201).json({
      error: null,
      success: true,
      body: product,
    });
  }

  static async getAllProduct(req, res, next) {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(',') };
      console.log(filter);
    }
    const productList = await Product.find(filter).populate('category');

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

  static async getProductById(req, res, next) {
    const id = req.params.id;
    if (!id) return;

    if (!mongoose.isValidObjectId(id))
      return res.status(200).json({
        error: 'invalid product id',
        success: false,
        body: null,
      });

    try {
      const product = await Product.findById(id).populate('category');

      if (!product)
        return res.status(500).json({
          error: 'cant fetch product',
          success: false,
          body: null,
        });

      return res.status(200).json({
        error: null,
        success: true,
        body: product,
      });
    } catch (error) {
      return res.status(500).json({
        error,
        success: false,
        body: null,
      });
    }
  }

  static async getProductCount(req, res, next) {
    const productCount = await Product.countDocuments();

    if (!productCount) {
      return res.status(500).json({
        error: 'Cant fetch product count',
        success: false,
        body: null,
      });
    }

    res.status(200).json({
      error: null,
      success: true,
      body: productCount,
    });
  }

  static async getFeaturedProducts(req, res, next) {
    const count = req.params.count ? req.params.count : 0;

    const products = await Product.find({ isFeatured: true }).limit(+count);

    if (!products) {
      return res.status(500).json({
        error: 'Cant fetch featured products',
        success: false,
        body: null,
      });
    }

    res.status(200).json({
      error: null,
      success: true,
      body: { products },
    });
  }

  static async updateProductById(req, res, next) {
    const id = req.params.id;
    if (!id) return;

    if (!mongoose.isValidObjectId(id))
      return res.status(200).json({
        error: 'invalid product id',
        success: false,
        body: null,
      });

    const category = await Category.findById(req.body.category);
    if (!category)
      return res.status(400).json({
        error: 'invalid category',
        success: false,
        body: null,
      });

    const product = await Product.findById(id);
    if (!product)
      return res.status(400).json({
        error: 'cant fetch product',
        success: false,
        body: null,
      });

    const file = req.file;
    let imagepath;

    if (file) {
      const fileName = file.filename;
      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
      imagepath = `${basePath}${fileName}`;
    } else {
      imagepath = product.image;
    }

    const updateProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: imagepath,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      { new: true }
    );

    if (!updateProduct)
      return res.status(500).json({
        error: 'the product cannot be updated',
        success: false,
        body: null,
      });

    res.json({
      error: null,
      success: true,
      body: updateProduct,
    });
  }

  static async updateGalleryImagesById(req, res, next) {
    const id = req.params.id;
    if (!id) return;

    if (!mongoose.isValidObjectId(id))
      return res.status(200).json({
        error: 'invalid product id',
        success: false,
        body: null,
      });

    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!product)
      return res.status(500).json({
        error: 'the product images cannot be updated',
        success: false,
        body: null,
      });

    res.json({
      error: null,
      success: true,
      body: product,
    });
  }

  static async deleteProductById(req, res, next) {
    const id = req.params.id;
    if (!id) return;

    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({
        error: 'invalid product id',
        success: false,
        body: null,
      });

    try {
      const product = await Product.findByIdAndRemove(id);
      if (!product) {
        return res.status(404).json({
          error: 'product not found',
          success: false,
          body: nulll,
        });
      }

      return res.status(200).json({
        error: null,
        success: true,
        body: 'product is deletd',
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

module.exports = ProductContorller;
