const createHttpError = require('http-errors');
const Product = require('../models/Product.model');
const { StatusCodes } = require('http-status-codes');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.create = (req, res, next) => {
  Product.create({ ...req.body, owner: req.currentUser })
    .then(product => res.status(StatusCodes.CREATED).json(product))
    .catch(next)
}

module.exports.list = (req, res, next) => {
  Product.find()
    .then(products => res.status(StatusCodes.OK).json(products))
    .catch(next)
}

module.exports.getProduct = (req, res, next) => {
  Product.findById(req.params.id)
    .then(product => {
      if (!product) {
        next(createHttpError(StatusCodes.NOT_FOUND, 'Product not found'))
      } else {
        res.status(StatusCodes.OK).json(product)
      }
    })
    .catch(next)
}

module.exports.createCheckoutSession = async (req, res, next) => {
  const { _id, price, name, description, imageUrl } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: name,
            description: description,
            images: [imageUrl]
          },
          unit_amount: parseFloat((price * 100).toFixed(2)),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.GYMHACK_WEB_URL}/store/${_id}?success=true`,
    cancel_url: `${process.env.GYMHACK_WEB_URL}/store/${_id}?canceled=true`,
  });

  res.json({url: session.url});
}
