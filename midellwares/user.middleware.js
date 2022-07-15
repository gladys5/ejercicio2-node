const { AppError } = require('../utils/app.Error.util')
const { catchAsync } = require('../utils/catchAsync.util')
const { User } = require('../models/user.model')
const jwt = require('jsonwebtoken')

const existUser = catchAsync(async (req, res, next) => {
  const { email } = req.body

  const user = await User.findOne({ where: { email, status: 'active' } })

  if (!user) {
    return next(new AppError('Username does not exist', 400))
  }

  req.user = user
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

module.exports = {
  existUser,
  protectToken,
  isAdmin,
  protectAccount,
}
