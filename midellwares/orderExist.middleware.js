const { AppError } = require('../utils/app.Error.util')
const { catchAsync } = require('../utils/catchAsync.util')
const { Order } = require('../models/order.model')

const orderExistByUser = catchAsync(async (req, res, next) => {
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
module.exports = { orderExistByUser }
