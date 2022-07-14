const { Restaurant } = require('../models/restaurant.model')
const { catchAsync } = require('../utils/catchAsync.util')
const { Review } = require('../models/review.model')
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
  const { name, address } = req.body

  const { restaurant } = req

  await restaurant.update({ name, address })

  res.status(200).json({
    status: 'success',
  })
})

//desabilita al restaurante
const desabilityRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req

  await restaurant.update({ status: 'cancel' })

  res.status(200).json({
    status: 'success',
  })
})
//Crear una nueva reseña en el restaurant, siendo :id el id del restaurant (enviar comment, rating (INT) en req.body)

const reviewOfRestaurant = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.params
  const { comment, rating } = req.body
  sessionUser.req.id
  const restaurant = await Restaurant.findOne({ where: { restaurantId } })
  const review = await Review.create({ comment, rating })
  res.status(201).json({
    review,
    restaurant,
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
