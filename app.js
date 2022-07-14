const express = require('express')

const { globalErrorHandler } = require('./controllers/error.controller')
const { AppError } = require('./utils/app.Error.util')
const { UserRouter } = require('./routes/user.routes')
const { RestaurantRouter } = require('./routes/restaurant.routes')
const { OrderRouter } = require('./routes/order.routes')
const { MealRouter } = require('./routes/meal.routes')
const app = express()
app.use(express.json())

app.use('/api/v1/restaurants', RestaurantRouter)
app.use('/api/v1/users', UserRouter)
app.use('/api/v1/orders', OrderRouter)
app.use('/api/v1/meals', MealRouter)

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `${req.method} ${req.originalUrl} not found in this server`,
      404
    )
  )
})
app.use(globalErrorHandler)

module.exports = { app }
