const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema2 = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Name should be less than 30 characters"],
    minLength: [3, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password should have more than 8 characters"],
    select: false,
  },
  passwordPresent: {
    type: String,
    default: "true",
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

//PASSWORD HASHING
userSchema2.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

//JWT TOKEN
userSchema2.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//COMPARE PASSWORD
userSchema2.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("UserPassword", userSchema2);
