const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: String,
  image: String,
});

exports.Category = mongoose.model('Category', categorySchema);
