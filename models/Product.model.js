const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.']
  },
  description: {
    type: String,
    required: [true, 'Description is required.']
  },
  price: {
    type: Number,
    required: [true, 'Price is required.']
  },
  imageUrl: {
    type: String,
    default: 'https://www.4me.com/wp-content/uploads/2018/01/4me-icon-product.png'
  },
  // category: {
  //   type: String,
  //   enum: ['food', 'drinks', 'other'],
  //   required: [true, 'Category is required.']
  // },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required.']
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
