const createHttpError = require('http-errors');
const User = require('../models/User.model');
const { StatusCodes } = require('http-status-codes');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.currentUser)
    .then(user => {
      if (!user) {
        next(createHttpError(StatusCodes.NOT_FOUND, 'User not found'))
      } else {
        res.json(user)
      }
    })
    .catch(next)
}