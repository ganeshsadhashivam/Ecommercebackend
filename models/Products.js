const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Can't be blank"],
    },
    description: {
      type: String,
      required: [true, "Can't ba blank"],
    },
    price: {
      type: String,
      required: [true, "Can't ba blank"],
    },
    category: {
      type: String,
      required: [true, "Can't ba blank"],
    },
    pictures: {
      type: Array,
      required: [true, "Can't ba blank"],
    },
  },
  { minimize: false }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
