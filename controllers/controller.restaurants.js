const { Restaurant } = require('../models/restaurant.model')
const { catchAsync } = require('../utils/catchAsync.util')
const { Review } = require('../models/review.model')
const { response } = require('express')
//Crear un nuevo restaurant (enviar name, address, rating (INT)) rating debe ser un valor del 1 al 5
const createNewRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body
  let restaurant = await Restaurant.create({ name, address, rating })
  res.status(201).json(restaurant)
})

//Obtener todos los restaurants con status active
const getRestaurantActive = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findAll({
    where: { status: 'active' },
  })

  res.status(200).json({
    restaurant,
  })
})

//Obtener restaurant por id
const getRestaurantById = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const restaurant = await Restaurant.findOne({ where: { id } })

  res.status(200).json({
    restaurant,
  })
})

//Actualizar restaurant (name, address)
const updateRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { name, address } = req.body

  const updateData = await Restaurant.findOne({ where: { id } })
  await updateData.update({ name, address })

  res.status(201).json({
    updateData,
    status: 'success',
  })
})

//desabilita al restaurante
const desabilityRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const restaurants = await Restaurant.findOne({ where: { id } })
  await restaurants.update({ status: 'cancel' })

  res.status(200).json({
    restaurants,
    status: 'success',
  })
})
//Crear una nueva reseña en el restaurant, siendo :id el id del restaurant (enviar comment, rating (INT) en req.body)

const reviewOfRestaurant = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body

  const restaurantId = +req.params.id

  const userId = req.sessionUser.id

  const review = new Review({ userId, comment, restaurantId, rating })

  res.status(201).json({
    status: 'success',
  })
})

//Actualizar una reseña hecha en un restaurant, siendo :id el id del restaurant (comment, rating) SOLO EL AUTOR DE LA RESEÑA PUEDE ACTUALIZAR SU PROPIA RESEÑA

const updateReview = catchAsync(async (req, res, next) => {
  sessionUser.req
  const { restaurantId } = req.params
  const { comment, rating } = req.body
  const review = await Review.findOne({
    where: { restaurantId },
    include: Restaurant,
  })
  await review.update({
    comment,
    rating,
  })
  res.status(201).json({
    review,

    status: 'success',
  })
})

//  /Actualizar una reseña hecha en un restaurant a status deleted, siendo :id el id del restaurant. SOLO EL AUTOR DE LA RESEÑA PUEDE ACTUALIZAR SU PROPIA RESEÑA

const reviewDown = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const restaurant = await Restaurant.findOne({ where: { id } })

  await restaurant.update({ status: 'deleted' })
  res.status(201).json({
    restaurant,
  })
})

module.exports = {
  createNewRestaurant,
  getRestaurantActive,
  getRestaurantById,
  updateRestaurant,
  desabilityRestaurant,
  reviewOfRestaurant,
  updateReview,
  reviewDown,
}
