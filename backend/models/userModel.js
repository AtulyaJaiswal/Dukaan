const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  passwordPresent: {
    type: String,
    default: "false",
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  actions: {
    productsViewed: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        numberOfTimesViewed: {
          type: Number,
          required: true,
        },
      },
    ],
    productsAddedToCart: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        numberOfTimesAdded: {
          type: Number,
          required: true,
        },
      },
    ],
    productsPurchased: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        numberOfTimesPurchased: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  rewards: [
    {
      couponName: {
        type: String,
      },
      usedAtDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  coins: {
    type: Number,
    default: 0,
  },
  coinsUsage: [
    {
      numberOfCoinsUsed: {
        type: Number,
      },
      usedAtDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  role: {
    type: String,
    default: "user",
  },
});

//JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", userSchema);
