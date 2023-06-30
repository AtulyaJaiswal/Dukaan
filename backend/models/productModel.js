const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter product Description"],
  },
  originalPrice: {
    type: Number,
    required: [true, "Please enter product Price"],
    maxLength: [8, "Price cannot exceed 8 digits"],
  },
  sellingPrice: {
    type: Number,
    required: [true, "Please enter product Price"],
    maxLength: [8, "Price cannot exceed 8 digits"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    requires: [true, "Please enter product category"],
  },
  Stock: {
    type: Number,
    requires: [true, "Please enter product Stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  numOFReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  numberOfViews: {
    type: Number,
    default: 0,
  },
  numberOfProductsSold: {
    type: Number,
    default: 0,
  },
  numberOfTimesAddedToCart: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
