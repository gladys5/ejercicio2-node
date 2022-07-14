const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const { User } = require('../models/user.model')
const { Order } = require('../models/order.model')
const { catchAsync } = require('../utils/catchAsync.util')
const { createToken } = require('../utils/token.util')
const { response } = require('express')
dotenv.config({ path: './config.env' })

const createUsers = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body
  const salt = await bcrypt.genSalt(12)
  const hashPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    name,
    email,
    password: hashPassword,
    role,
  })

  user.password = undefined

  res.status(201).json({
    user,
  })
})

//Iniciar sesión (enviar email y password por req.body)

const logins = catchAsync(async (req, res = response, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ where: { email, password } })
  const token = await createToken(user.id)

  res.json({
    status: 'success',
    token,
    user: {
      name: user.name,
      uid: user.id,
    },
  })
})

// Send response

//Actualizar perfil de usuario (solo name y email)
const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { name, email } = req.body
  const user = await User.findOne({ where: { id } })
  await user.update({ name, email })
  res.status(201).json({
    user,
    status: 'success',
  })
})

//Deshabilitar cuenta de usuario
const desabilityUser = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const user = await User.findOne({ where: { id } })

  await user.update({ status: 'cancel' })

  res.status(204).json({ status: 'success' })
})

//Obtener todas las ordenes hechas por el usuario
const getOrderOfUser = catchAsync(async (req, res, next) => {
  const { order } = req

  res.json({
    ok: true,
    order,
  })
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
  const user = await User.findAll()
  res.json({
    user,
  })
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
