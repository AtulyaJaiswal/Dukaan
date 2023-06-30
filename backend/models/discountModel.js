const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter discount name"],
    trim: true,
  },
  code: {
    type: String,
    required: [true, "Please enter discount code"],
    trim: true,
  },
  value: {
    type: Number,
    required: [true, "Please enter discount percentage"],
  },
  coinsNeededToRedeem: {
    type: Number,
    required: true,
  },
  numberOfTimesUsed: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Discount", discountSchema);
