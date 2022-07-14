const { Order } = require('../models/order.model')
const { Meal } = require('../models/meal.model')
const { catchAsync } = require('../utils/catchAsync.util')

//Crear una nueva order (enviar quantity y mealId por req.body)
const newOrder = catchAsync(async (req, res, next) => {
  const { quantity, mealId } = req.body
  const priceProduct = await Meal.findOne({ where: { id: mealId } })

  const valueTotal = quantity * priceProduct.price

  let order = await Order.create({
    quantity,
    mealId,
    userId: 1,
    totalPrice: valueTotal,
  })
  res.status(201).json(order)
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

  await Order.update({ status: 'completed' })
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
