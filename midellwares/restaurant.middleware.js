const { AppError } = require('../utils/app.Error.util')
const { catchAsync } = require('../utils/catchAsync.util')
const { Restaurant } = require('../models/restaurant.model')
const { Review } = require('../models/review.model')
const { User } = require('../models/user.model')

const ratingParameter = (req, res, next) => {
  const { rating = 0 } = req.body

  if (rating < 1 || rating > 5) {
    return next(new AppError('The rating is not valid', 400))
  }

  next()
}

const chechExistRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const restaurant = await Restaurant.findOne({
    where: { id, status: 'active' },
    attributes: { include: ['status'] },
    include: [
      {
        model: Review,
        attributes: {
          include: ['status', 'restaurantId', 'userId'],
        },
        include: [
          {
            model: User,
            attributes: {
              include: ['password', 'role', 'status'],
            },
          },
        ],
      },
    ],
  })

  if (!restaurant) {
    return next(new AppError('The restaurant is not registered', 400))
  }

  req.restaurant = restaurant
  next()
})

const existRestaurantId = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.params

  const restaurant = await Restaurant.findOne({
    where: {
      id: restaurantId,
      status: 'active',
    },
  })

  if (!restaurant) {
    return next(new AppError('The restaurant is not registered', 400))
  }

  req.restaurant = restaurant

  next()
})

const existReview = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const review = await Review.findOne({
    where: {
      id,
      status: 'active',
    },
    include: [{ model: User, attributes: { exclude: ['password'] } }],
  })

  if (!review) {
    return next(new AppError('The review is not found', 404))
  }

  req.review = review
  req.user = review.user

  next()
})

module.exports = {
  ratingParameter,
  chechExistRestaurant,
  existRestaurantId,
  existReview,
}
