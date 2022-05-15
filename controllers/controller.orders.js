const { Order } = require('../models/model.order');
const { Meal } = require('../models/model.meal');
const { catchAsync } = require('../utils/catchAsync');

//Crear una nueva order (enviar quantity y mealId por req.body)
const newOrder = catchAsync(async (req, res, next) => {
  try {
    const { quantity, mealId } = req.body;
    const priceProduct = await Meal.findOne({ where: { id: mealId } });

    const valueTotal = quantity * priceProduct.price;

    let order = await Order.create({
      quantity,
      mealId,
      userId: 1,
      totalPrice: valueTotal,
    });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

//Obtener todas las órdenes del usuario
const getOrderOfOneUser = catchAsync(async (req, res, next) => {
  try {
    const order = await Order.findAll();
    res.status(200).json({
      order,
    });
  } catch (err) {
    next(err);
  }
});

//Marcar una orden por id con status completed
const orderWhitStatusActive = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ where: { id } });

    await Order.update({ status: 'completed' });
    res.status(201).json({
      order,
    });
  } catch (err) {
    next(err);
  }
});

//Marcar una orden por id con status cancelled
const orderWhitStatusCansel = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ where: { id } });

    await order.update({ status: 'cancelled' });
    res.status(201).json({
      order,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = {
  getOrderOfOneUser,
  newOrder,
  orderWhitStatusActive,
  orderWhitStatusCansel,
};

/**
/api/v1/orders
HTTP Verb
Route
Description
POST
/
Crear una nueva order (enviar quantity y mealId por req.body)
GET
/me
Obtener todas las órdenes del usuario
PATCH
/:id
Marcar una orden por id con status completed
DELETE
/:id
Marcar una orden por id con status cancelled


Todas las rutas deben estar protegidas por un método de autentificación.
Para el endpoint POST / se debe realizar lo siguiente:
Se debe buscar si existe la comida (meal), si no, enviar error.
Calcular el precio para el usuario, multiplicar el precio de la comida (meal) encontrada previamente, por la cantidad solicitada por el usuario.
Crear una nueva orden, pasando el precio calculado, el mealId de la comida ya encontrada y la cantidad solicitada por el usuario.
Para el endpoint PATCH y DELETE, validar que la orden este con status active antes de realizar la operación, enviar error en caso de que no tenga este status.
Solo el usuario que hizo la orden solamente puede realizar estas operaciones
Para el endpoint /me, se debe incluir la información de la comida que se ordenó, y del restaurant de donde se pidió la comida.
 */
