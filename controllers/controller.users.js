const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const { User } = require('../models/user.model')
const { Order } = require('../models/order.model')
const { catchAsync } = require('../utils/catchAsync.util')
const jwt = require('jsonwebtoken')
dotenv.config({ path: './config.env' })

const createUsers = catchAsync(async (req, res, next) => {
  const { name, age, email, password, role } = req.body

  // Hash password
  const salt = await bcrypt.genSalt(12)
  const hashPassword = await bcrypt.hash(password, salt)

  const newUser = await User.create({
    name,
    age,
    email,
    password: hashPassword,
    role,
  })

  // Remove password from response
  newUser.password = undefined

  res.status(201).json({
    status: 'success',
    newUser,
  })
})

//Iniciar sesión (enviar email y password por req.body)

const logins = catchAsync(async (req, res = response, next) => {
  const { email, password } = req.body

  // Validate credentials (email)
  const user = await User.findOne({
    where: {
      email,
      status: 'active',
    },
  })

  if (!user) {
    return next(new AppError('Credentials invalid', 400))
  }

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return next(new AppError('Credentials invalid', 400))
  }

  // Generate JWT (JsonWebToken) ->
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
  console.log(token)
  // Send response
  res.status(200).json({
    status: 'success',
    token,
  })
})

// Send response

//Actualizar perfil de usuario (solo name y email)
const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req
  const { name, email } = request.body
  await user.update({ name, email })
  res.status(200).json({ status: 'succes' })
})

//Deshabilitar cuenta de usuario
const desabilityUser = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const user = await User.findOne({ where: { id } })
  await user.update({ status: 'deleted' })
  res.status(200).json({ status: 'succes' })
})

//Obtener todas las ordenes hechas por el usuario
const getOrderOfUser = catchAsync(async (req, res, next) => {
  const { sessionUser } = req
  const order = await Order.findAll({ where: { userId: sessionUser.id } })
  res.status(200).json({ order })
})

//Obtener detalles de una sola orden dado un ID

const getOrderById = catchAsync(async (req, res, next) => {
  const { sessionUser } = req
  const orders = await Order.findOne({
    where: {
      userId: sessionUser.id,
    },
  })
  res.status(200).json({ orders })
})

const getAll = catchAsync(async (req, res, next) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } })
  res.status(200).json({ users })
})
module.exports = {
  createUsers,
  logins,
  updateUser,
  desabilityUser,
  getOrderOfUser,
  getOrderById,
  getAll,
}
