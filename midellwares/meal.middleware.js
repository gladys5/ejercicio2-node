const { AppError } = require('../utils/app.Error.util')
const { catchAsync } = require('../utils/catchAsync.util')
const { Meal } = require('../models/meal.model')
const { Restaurant } = require('../models/restaurant.model')

const existMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const meal = await Meal.findOne({
    where: {
      id,
      status: 'active',
    },
    attributes: { exclude: ['status'] },
    include: [
      {
        model: Restaurant,
        attributes: {
          exclude: ['status'],
        },
      },
    ],
  })

  if (!meal) {
    return next(new AppError('The meal is not found', 404))
  }

  req.meal = meal

  next()
})

module.exports = {
  existMeal,
}
