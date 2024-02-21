const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    slug: { type: String, slug: 'title', unique: true },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;

// const productCategorySchema = new mongoose.Schema({
//   title: String,
//   parent_id: {
//     type: String,
//     default: ""
//   },
//   slug: {
//     type: String,
//     slug: "title",
//     unique: true
//   },
//   description: String,
//   thumbnail: String,
//   status: String,
//   position: Number,
//   deleted: {
//     type: Boolean,
//     default: false
//   },
//   deletedAt: Date
// }, {
//   timestamps: true
// });
