const ProductContorller = require('../controllers/product');

const express = require('express');
const multer = require('multer');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValide = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('invalid image type');

    if (isValide) {
      uploadError = null;
    }
    cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});
const uploadOptions = multer({ storage });

const router = express.Router();

router.get(`/`, ProductContorller.getAllProduct);

router.get(`/:id`, ProductContorller.getProductById);

router.get(`/get/count`, ProductContorller.getProductCount);

router.get(`/get/featured/:count`, ProductContorller.getFeaturedProducts);

router.post(`/`, uploadOptions.single('image'), ProductContorller.createProduct);

router.put(`/:id`, uploadOptions.single('image'), ProductContorller.updateProductById);

router.put(
  `/gallery-images/:id`,
  uploadOptions.array('images', 10),
  ProductContorller.updateGalleryImagesById
);

router.delete(`/:id`, ProductContorller.deleteProductById);

module.exports = router;
