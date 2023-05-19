const mongoose = require('mongoose');
const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
  static async createUser(req, res, next) {
    const passwordHash = bcrypt.hashSync(req.body.password, 10);

    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street || '',
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });

    try {
      user = await user.save();

      if (!user)
        return res.status(400).json({
          error,
          success: false,
          body: null,
        });

      return res.status(201).json({
        error: null,
        success: true,
        body: user,
      });
    } catch (error) {
      return res.status(500).json({
        error,
        success: false,
        body: null,
      });
    }
  }

  static async getAlluser(req, res, next) {
    try {
      const userList = await User.find().select('-passwordHash');
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
    } catch (error) {
      return res.status(500).json({
        error: 'Cant fetch user list',
        success: false,
        body: null,
      });
    }
  }

  static async getUserById(req, res, next) {
    const id = req.params.id;
    if (!id) return;

    if (!mongoose.isValidObjectId(id))
      return res.status(404).json({
        error: 'invalid id',
        success: false,
        body: null,
      });

    try {
      const user = await User.findById(id).select('-passwordHash');
      if (!user) {
        return res.status(500).json({
          error: 'Cant fetch user',
          success: false,
          body: null,
        });
      }

      return res.status(200).json({
        error: null,
        success: true,
        body: user,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Cant fetch user',
        success: false,
        body: null,
      });
    }
  }

  static async updateUser(req, res, next) {
    const id = req.params.id;
    if (!id) return;

    if (!mongoose.isValidObjectId(id))
      return res.status(200).json({
        error: 'invalid user id',
        success: false,
        body: null,
      });

    const userExist = await User.findById(req.params.id);

    if (req.body.password) {
      userExist.passwordHash = bcrypt.hashSync(req.body.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        name: req.body.name || userExist.name,
        email: req.body.email || userExist.email,
        passwordHash: userExist.passwordHash,
        phone: req.body.phone || userExist.phone,
        isAdmin: req.body.isAdmin || userExist.isAdmin,
        street: req.body.street || userExist.street,
        apartment: req.body.apartment || userExist.apartment,
        zip: req.body.zip || userExist.zip,
        city: req.body.city || userExist.city,
        country: req.body.country || userExist.country,
      },
      { new: true }
    );

    if (!user)
      return res.status(400).json({
        error: 'the user cannot be updated',
        success: false,
        body: null,
      });

    res.json({
      error: null,
      success: true,
      body: user,
    });
  }

  static async getUserCount(req, res, next) {
    const userCount = await User.countDocuments();

    if (!userCount)
      return res.status(500).json({
        error: 'cant fetch users list',
        success: false,
        body: null,
      });

    return res.status(200).json({
      error: null,
      success: true,
      body: userCount,
    });
  }

  static async login(req, res, next) {
    const email = req.body.email;
    const secret = process.env.JWT_TOKEN_STRING;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({
        error: 'The user not found',
        success: false,
        body: null,
      });

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        secret,
        {
          expiresIn: '3d',
        }
      );

      return res
        .status(200)
        .json({ error: null, success: true, body: { user: user.email, token } });
    }

    return res.status(400).json({
      error: 'wrong password',
      success: false,
      body: null,
    });
  }

  static async deleteUserById(req, res, next) {
    const id = req.params.id;
    if (!id) return;

    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({
        error: 'Invalid id',
        success: false,
        body: null,
      });

    const user = await User.findByIdAndDelete(id);

    if (!user)
      return res.status(400).json({
        error: 'cant fetch user, or wrong user id',
        success: false,
        body: null,
      });

    return res.status(200).json({
      error: null,
      success: true,
      body: 'user is deleted',
    });
  }
}

module.exports = UserController;
