const express = require('express');

const app = express();
const { UserRouter } = require('./routes/route.user');
const { RestaurantRouter } = require('./routes/route.restaurant');
const { OrderRouter } = require('./routes/route.order');
const { MealRouter } = require('./routes/route.meals');
const { globalErrorHandler } = require('./utils/globalError');
app.use(express.json());
app.use('/api/v1/restaurant', RestaurantRouter);
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/orders', OrderRouter);
app.use('/api/v1/meals', MealRouter);
app.use('*', globalErrorHandler);

module.exports = { app };
