const { User } = require('../models/user');

class UserController {
  static async getAlluser(req, res, next) {
    const userList = await User.find();
    if (!userList) {
      return res.status(500).json({
        error: 'Cant fetch user list',
        success: false,
        body: null,
      });
    }

    return res.status(200).json({
      error: null,
      success: true,
      body: userList,
    });
  }
  static createUser(req, res, next) {
    const user = new User({
      name: req.body.name,
      image: req.body.image,
    });

    user
      .save()
      .then((createdUser) => {
        return res.status(201).json({
          error: null,
          success: true,
          body: createdUser,
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

module.exports = UserController;
