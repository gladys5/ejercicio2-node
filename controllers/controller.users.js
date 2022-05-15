const { User } = require('../models/model.user');
const { Order } = require('../models/model.order');
const bcrypt = require('bcryptjs');
const { AppError } = require('../utils/app.error');
const { catchAsync } = require('../utils/catchAsync');

const createUser = catchAsync(async (req, res, next) => {
  try {
    const { name, password, email, role } = req.body;
    const accountNumber = Math.floor(Math.random() * 999999);
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      accountNumber,
      email,
      password: hashPassword,
      role,
    });

    newUser.password = undefined;
    res.status(201).json({
      newUser,
    });
  } catch (err) {
    next(err);
  }
});

//Iniciar sesión (enviar email y password por req.body)

const logins = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email, status: 'active' } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Invalid argument', 400));
    }
    res.status(201).json({
      user,
    });
  } catch (err) {
    next(err);
  }
});

//Actualizar perfil de usuario (solo name y email)
const updateUser = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(400).json({
        message: 'not cant update',
      });
    }
    await user.update({ name, email });

    res.status(200).json({
      user,
    });
  } catch (err) {
    next(err);
  }
});

//Deshabilitar cuenta de usuario
const desabilityUser = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.body;
    const user = await User.findOne({ where: { id } });
    // if (!user) {
    //   return res.status(200).json({
    //     message: 'User does exist',
    //   });
    // }
  } catch (err) {
    next(err);
  }
});

//Obtener todas las ordenes hechas por el usuario
const getOrderOfUser = catchAsync(async (req, res, next) => {
  try {
    const { order } = req.body;
    const user = await User.findAll({ where: { order } });

    res.status(200).json({
      user,
    });
  } catch (err) {
    next(err);
  }
});

//Obtener detalles de una sola orden dado un ID

const getOrderById = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id },
      include: [{ model: Order }],
    });

    res.status(200).json({
      user,
    });
  } catch (err) {
    next(err);
  }
});

/*Todas las rutas, excepto para crear usuario e iniciar sesión, se deben proteger por un medio de autentificación, es decir, por JWT.
  Se debe usar express-validator para el endpoint de crear usuarios.
  Se debe encriptar la contraseña usando bcryptjs
  El endpoint /orders y /orders/:id, debe buscar las órdenes del usuario en sesión (del token que se envió), extraer el id del token y usarlo para buscar dichas órdenes.
  Los métodos PATCH y DELETE deben estar protegidos para que únicamente el dueño de la cuenta a modificar pueda realizar dichas acciones.
  Para los endpoints /orders, se debe incluir la siguiente información:
  La comida que se ordenó
  El restaurant de donde se pidió la comida
  */

module.exports = {
  createUser,
  logins,
  updateUser,
  desabilityUser,
  getOrderOfUser,
  getOrderById,
};
