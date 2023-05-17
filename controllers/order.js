const { Order } = require('../models/order');

class OrderController {
  static async getAllOrder(req, res, next) {
    const orderList = await Order.find();

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

  static async createOrder(req, res, next) {
    const category = new Order({
      name: req.body.name,
      image: req.body.image,
    });

    category
      .save()
      .then((createdOrder) => {
        return res.status(201).json({
          error: null,
          success: true,
          body: createdOrder,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          error,
          success: false,
          body: null,
        });
      });
  }
}

module.exports = OrderController;
