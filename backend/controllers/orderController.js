const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const UserPassword = require("../models/userModel2");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//CREATE NEW ORDER
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    shippingPrice,
    totalPrice,
    coinsUsed,
  } = req.body;

  for (let i = 0; i < orderItems.length; i++) {
    const product = await Product.findById(req.body.orderItems[i].product);

    var views = product.numberOfProductsSold;
    views = views + 1;
    product.numberOfProductsSold = views;

    await product.save({ validateBeforeSave: false });

    var flag = false;
    for (let j = 0; j < req.user.actions.productsPurchased.length; j++) {
      if (
        req.user.actions.productsPurchased[j].productId.toString() ===
        req.body.orderItems[i].product.toString()
      ) {
        req.user.actions.productsPurchased[j].numberOfTimesPurchased += 1;
        flag = true;
        break;
      }
    }

    if (!flag) {
      req.user.actions.productsPurchased.push({
        productId: req.body.orderItems[i].product,
        numberOfTimesPurchased: 1,
      });
    }

    var coinsPrevious = req.user.coins;
    coinsPrevious += Math.floor(itemsPrice / 100);
    req.user.coins = coinsPrevious;
    req.user.coinsUsage.push({
      numberOfCoinsUsed: Math.floor(itemsPrice / 100),
    });

    coinsPrevious = req.user.coins;
    coinsPrevious -= coinsUsed;
    req.user.coins = coinsPrevious;
    req.user.coinsUsage.push({
      numberOfCoinsUsed: coinsUsed,
    });

    req.user.save({ validateBeforeSave: false });
  }

  await Order.create({
    shippingInfo,
    orderItems,
    coinsEarned: Math.floor(itemsPrice / 100),
    paymentInfo,
    itemsPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Order Placed Successfully",
  });
});

//GET SINGLE ORDER
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  //POPULATE:- user field se id lega aur database me jaakr uska name email nikaal laiga

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//GET LOGGED IN USER ORDER
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  orders.reverse();

  res.status(200).json({
    success: true,
    orders,
  });
});

//GET ALL ORDERS -ADMIN
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

//UPDATE ORDER STATUS -ADMIN
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (ord) => {
      await updateStock(ord.product, ord.quantity);
    });
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//UPDATING STOCK
async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

//DELETE ORDER -ADMIN
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  //REMOVING COINS EARNED WITH ORDER
  var user = await User.findById(order.user);
  if (user === null) {
    user = await UserPassword.findById(req.params.user_id);
  }
  user.coins -= order.coinsEarned;
  coinsUsage.push({
    numberOfCoinsUsed: -order.coinsEarned,
  });
  await user.save({ validateBeforeSave: false });

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    order,
  });
});
