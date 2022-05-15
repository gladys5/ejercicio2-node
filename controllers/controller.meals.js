const { Restaurant } = require('../models/model.restaurant');
const { Meal } = require('../models/model.meal');
const { catchAsync } = require('../utils/catchAsync');

//Crear una nueva comida en el restaurant, siendo :id el id del restaurant (enviar name, price (INT) en req.body)
const newMealById = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    console.log(name, price);

    const meal = await Restaurant.findOne({ where: { id } });

    const createMeal = await Meal.create({ name, price, restaurantId: id });
    console.log(createMeal);

    res.status(200).json({
      createMeal,
    });
  } catch (err) {
    next(err);
  }
});

//Obtener todas las comidas con status active
const getMealThatIsActive = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;

    const meal = await Meal.findAll({
      where: { status: 'active' },
    });

    res.status(200).json({ meal });
  } catch (err) {
    next(err);
  }
});

//Obtener por id una comida con status active
const getMealById = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.body;
    const meal = await Meal.findOne({ where: { id } });

    res.status(200).json({
      meal,
    });
  } catch (err) {
    next(err);
  }
});
//Actualizar comida (name, price)
const updateMeal = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    const meal = await Meal.findOne({ where: { id } });

    await Meal.update({ name, price });

    res.status(200).json({
      meal,
      name,
      price,
    });
  } catch (err) {
    next(err);
  }
});

//Deshabilitar comida
const disable = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const meal = await Meal.findOne({ where: { id } });

    await Meal.update({ status: 'disable' });
    res.status(201).json({
      meal,
    });
  } catch (err) {
    next(err);
  }
});
module.exports = {
  newMealById,
  updateMeal,
  getMealById,
  getMealThatIsActive,
  disable,
};
