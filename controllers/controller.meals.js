const { Restaurant } = require('../models/restaurant.model')
const { Meal } = require('../models/meal.model')
const { catchAsync } = require('../utils/catchAsync.util')

//Crear una nueva comida en el restaurant, siendo :id el id del restaurant (enviar name, price (INT) en req.body)
const newMealById = catchAsync(async (req, res, next) => {
  const { name, price } = req.body
  const restaurantId = req.restaurant.id
  const meal = new Meal({ name, price, restaurantId })
  res.status(201).json({
    meal,
    status: 'success',
  })
})

//Obtener todas las comidas con status active
const getMealThatIsActive = catchAsync(async (req, res, next) => {
  const meals = await Meal.findAll({
    where: {
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

  res.json({
    status: 'success',
    meals,
  })
})

//Obtener por id una comida con status active
const getMealById = catchAsync(async (req, res, next) => {
  const { meal } = req
  const { id } = req.params
  const foundMeal = await Meal.findOne({ where: { id } })
  res.json({
    foundMeal,
    meal,
  })
})
//Actualizar comida (name, price)
const updateMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { name, price } = req.body

  const meals = await Meal.findOne({ where: { id } })

  await meals.update({ name, price })

  res.status(200).json({
    meals,
  })
})

//Deshabilitar comida
const disable = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const meal = await Meal.findOne({ where: { id } })

  await meal.update({ status: 'disable' })
  res.status(201).json({
    meal,
  })
})
module.exports = {
  newMealById,
  updateMeal,
  getMealById,
  getMealThatIsActive,
  disable,
}
