const { Restaurant } = require('../models/model.restaurant');
const { Meal } = require('../models/model.meal');
const { catchAsync } = require('../utils/catchAsync');
//Crear un nuevo restaurant (enviar name, address, rating (INT)) rating debe ser un valor del 1 al 5
const createNewRestaurant = catchAsync(async (req, res, next) => {
  try {
    const { name, address, ranting } = req.body;
    let restaurant = await Restaurant.create({ name, address, ranting });
    res.status(201).json(restaurant);
  } catch (err) {
    next(err);
  }
});

//Obtener todos los restaurants con status active
const getRestaurantActive = catchAsync(async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findAll({
      where: { status: 'exist' },
      include: [{ model: Meal }],
    });

    res.status(200).json({
      restaurant,
    });
  } catch (err) {
    next(err);
  }
});

//Obtener restaurant por id
const getRestaurantById = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({ where: { id } });

    res.status(200).json({
      restaurant,
    });
  } catch (err) {
    next(err);
  }
});

//Actualizar restaurant (name, address)
const updateRestaurant = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, address } = req.body;

    const restaurant = await Restaurant.findOne({ where: { id } });
    // if (!restaurant) {
    //   return res.status(400).json({
    //     message: 'does exist',
    //   });
    //}
    await restaurant.update({ name, address });

    res.status(200).json({
      restaurant,
    });
  } catch (err) {
    next(err);
  }
});

//desabilita al restaurante
const desabilityRestaurant = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({ where: { id } });
    // if (!restaurant) {
    //   return res.status(400).json({
    //     message: 'does exist',
    //   });
    // }
    await restaurant.update({ status: 'cancelled' });
    res.status(201).json({
      restaurant,
    });
  } catch (err) {
    next(err);
  }
});
//Crear una nueva reseña en el restaurant, siendo :id el id del restaurant (enviar comment, rating (INT) en req.body)

const reviewOfRestaurant = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment, ranting } = req.body;

    const restaurant = await Restaurant.findOne({ where: { id } });

    await restaurant.update({ comment, ranting });

    res.status(200).json({
      restaurant,
    });
  } catch (err) {
    next(err);
  }
});

//Actualizar una reseña hecha en un restaurant, siendo :id el id del restaurant (comment, rating) SOLO EL AUTOR DE LA RESEÑA PUEDE ACTUALIZAR SU PROPIA RESEÑA

const updateReview = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({ where: { id } });
    if (!restaurant) {
      return res.status(400).json({
        message: 'does exist',
      });
    }
    res.status(200).json({
      restaurant,
    });
  } catch (err) {
    next(err);
  }
});

//  /Actualizar una reseña hecha en un restaurant a status deleted, siendo :id el id del restaurant. SOLO EL AUTOR DE LA RESEÑA PUEDE ACTUALIZAR SU PROPIA RESEÑA

const reviewDown = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({ where: { id } });
    if (!restaurant) {
      return res.status(400).json({
        message: 'does exist',
      });
    }
    await restaurant.update({ status: 'deleted' });
    res.status(201).json({
      restaurant,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = {
  createNewRestaurant,
  getRestaurantActive,
  getRestaurantById,
  updateRestaurant,
  desabilityRestaurant,
  reviewOfRestaurant,
  updateReview,
  reviewDown,
};
