const bcrypt = require('bcryptjs')
const { AppError } = require('../utils/app.Error.util')
const { catchAsync } = require('../utils/catchAsync.util')
const { User } = require('../models/user.model')
const jwt = require('jsonwebtoken')
const { Order } = require('../models/order.model')

const checkExistEmail = catchAsync(async (req, res, next) => {
  const { name, email, password, role = 'normal' } = req.body

  const existEmail = await User.findOne({
    where: {
      email,
      status: 'active',
    },
  })

  if (existEmail) {
    return next(new AppError('email is not does exist', 400))
  }

  req.user = { name, email, password, role }
  next()
})

const isRole = catchAsync(async (req, res, next) => {
  const { role = 'normal' } = req.body

  if (role !== 'admin' && role !== 'normal') {
    return next(new AppError('the role is not allowed', 400))
  }

  next()
})

const existUser = catchAsync(async (req, res, next) => {
  const { email } = req.body

  const user = await User.findOne({ where: { email, status: 'active' } })

  if (!user) {
    return next(new AppError('Username does not exist', 400))
  }

  req.user = user
  next()
})

const checkUserId = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const user = await User.findOne({ where: { id, status: 'active' } })

  if (!user) {
    return next(new AppError('Username does not exist ', 400))
  }

  req.user = user
  next()
})

const validPassowrd = catchAsync(async (req, res, next) => {
  const { user } = req
  const { email, password } = req.body

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credential', 400))
  }

  next()
})

const protectToken = catchAsync(async (req, res, next) => {
  let token

  //extract token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new AppError('Session invalid', 403))
  }

  //validate token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET)

  const user = await User.findOne({
    where: { id: decoded.id, status: 'active' },
  })

  if (!user) {
    return next(
      new AppError(
        'We are sorry, you have been disconnected due to inactivity or the consultation time has expired, please renew your login',
        403
      )
    )
  }

  req.sessionUser = user

  next()
})

const isAdmin = catchAsync(async (req, res, next) => {
  if (req.sessionUser.role !== 'admin') {
    return next(new AppError('you are not account administrator', 403))
  }

  next()
})

const protectAccount = catchAsync(async (req, res, next) => {
  const { sessionUser, user } = req

  if (sessionUser.id !== user.id) {
    return next(new AppError('your data does not correspond ', 403))
  }

  next()
})

const existOrderForUser = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const { sessionUser } = req

  const order = await Order.findOne({
    where: {
      id,
      userId: sessionUser.id,
    },
  })

  if (!order) {
    return next(new AppError('Order not found', 404))
  }

  req.order = order
  next()
})

module.exports = {
  checkExistEmail,
  isRole,
  existUser,
  validPassowrd,
  protectToken,
  isAdmin,
  checkUserId,
  protectAccount,
  existOrderForUser,
}
