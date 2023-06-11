const mongoose = require('mongoose');

const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');

class OrderController {
  static async createOrder(req, res, next) {
    const orderItemsIds = req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    });

    let orderItemsIdsResolved = await Promise.all(orderItemsIds);

    let totalPrice = await Promise.all(
      orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalprice = orderItem.product.price * orderItem.quantity;

        return totalprice;
      })
    );

    totalPrice = totalPrice.reduce((a, b) => a + b, 0);

    let order = new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice,
      user: req.body.user,
    });

    order = await order.save();

    if (!order)
      return res.status(500).json({
        error: 'The order cannot be created',
        success: false,
        body: null,
      });

    return res.status(201).json({
      error: null,
      success: true,
      body: order,
    });
  }

  static async getAllOrder(req, res, next) {
    const orderList = await Order.find().populate('user', 'name').sort({ dateOrdered: -1 });

    if (!orderList) {
      return res.status(500).json({
        error: 'Cant fetch Order list',
        success: false,
        body: null,
      });
    }

    res.status(200).json({
      error: null,
      success: true,
      body: orderList,
    });
  }

  static async getOrderById(req, res, next) {
    const id = req.params.id;
    if (!id) return;

    if (!mongoose.isValidObjectId(id))
      return res.status(404).json({
        error: 'invalid order id',
        success: false,
        body: null,
      });

    const order = await Order.findById(id)
      .populate('user', 'name')
      .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } });

    if (!order)
      return res.status(404).json({
        error: 'cant fetch order or wrong order id',
        success: false,
        body: null,
      });

    return res.status(200).json({
      error: null,
      success: true,
      body: order,
    });
  }

  static async getUserOrderList(req, res, next) {
    const userOrderList = await Order.find({ user: req.params.userid })
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          populate: 'category',
        },
      })
      .sort({ dateOrdered: -1 });

    if (!userOrderList)
      return res.status(500).json({
        error: 'cant fetch orders',
        success: false,
        body: null,
      });

    return res.status(200).json({
      error: null,
      success: true,
      body: userOrderList,
    });
  }

  static async getTotalSales(req, res, next) {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } },
    ]);

    if (!totalSales) {
      return res.status(400).send({
        error: 'The order sales cannot be generated',
        success: false,
        body: null,
      });
    }

    res.send({
      error: null,
      success: true,
      body: totalSales.pop().totalsales,
    });
  }

  static async getCount(req, res, next) {
    const orderCount = await Order.countDocuments();

    if (!orderCount) {
      res.status(500).json({ error: 'Internal Error', success: false, body: null });
    }
    res.send({
      error: null,
      success: true,
      body: orderCount,
    });
  }

  static async updateCategoryById(req, res, next) {
    const id = req.params.id;
    if (!id) return;

    if (!mongoose.isValidObjectId(id))
      return res.status(200).json({
        error: 'invalid order id',
        success: false,
        body: null,
      });

    const order = await Order.findByIdAndUpdate(
      id,
      {
        status: req.body.status,
      },
      { new: true }
    );

    if (!order)
      return res.status(400).json({
        error: 'the order cannot be updated',
        success: false,
        body: null,
      });

    res.json({
      error: null,
      success: true,
      body: order,
    });
  }

  static async deleteOrderById(req, res, next) {
    const id = req.params.id;
    if (!id) return;

    if (!mongoose.isValidObjectId(id))
      return res.status(200).json({
        error: 'invalid order id',
        success: false,
        body: null,
      });

    try {
      const order = await Order.findByIdAndRemove(id);
      if (!order) {
        return res.status(404).json({
          error: 'Order not found',
          success: false,
          body: nulll,
        });
      }

      await order.orderItems.map(async (orderItem) => {
        console.log(orderItem);
        await OrderItem.findByIdAndRemove(orderItem);
      });

      return res.status(200).json({
        error: null,
        success: true,
        body: 'Order is deleted',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Order not found',
        success: false,
        body: null,
      });
    }
  }
}

module.exports = OrderController;
