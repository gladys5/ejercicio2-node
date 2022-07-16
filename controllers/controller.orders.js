const { Order } = require('../models/order.model')
const { Meal } = require('../models/meal.model')
const { Restaurant } = require('../models/restaurant.model')
const { catchAsync } = require('../utils/catchAsync.util')

//Crear una nueva order (enviar quantity y mealId por req.body)
const newOrder = catchAsync(async (req, res, next) => {
  const { quantity } = req.body
  const { meal } = req
  const { sessionUser } = req

  const totalPrice = quantity * meal.price

  const order = await Order.create({
    mealId: meal.id,
    userId: sessionUser.id,
    totalPrice,
    quantity,
  })

  res.json({
    order,
    status: 'success',
  })
})

//Obtener todas las órdenes del usuario
const getOrderOfOneUser = catchAsync(async (req, res, next) => {
  const { sessionUser } = req

  const order = await Order.findAll({
    where: {
      userId: sessionUser.id,
    },
    include: [
      {
        model: Meal,
        attributes: {
          exclude: ['status'],
        },
        include: [
          {
            model: Restaurant,
            attributes: {
              exclude: ['status'],
            },
          },
        ],
      },
    ],
  })

  res.json({
    status: 'success',
    order,
  })
})

//Marcar una orden por id con status completed
const orderWhitStatusActive = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const order = await Order.findOne({ where: { id } })

  await order.update({ status: 'completed' })
  res.status(201).json({
    order,
  })
})

//Marcar una orden por id con status cancelled
const orderWhitStatusCansel = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const order = await Order.findOne({ where: { id } })

  await order.update({ status: 'cancelled' })
  res.status(201).json({
    order,
  })
})

module.exports = {
  getOrderOfOneUser,
  newOrder,
  orderWhitStatusActive,
  orderWhitStatusCansel,
}
