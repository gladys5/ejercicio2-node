const { app } = require('./app')
const { db } = require('./utils/db')
const { User } = require('./models/user.model')
const { Meal } = require('./models/meal.model')
const { Order } = require('./models/order.model')
const { Restaurant } = require('./models/restaurant.model')
const { Review } = require('./models/review.model')
db.authenticate()

  .then(() => console.log('db authenticate'))

  .catch((err) => console.log(err))

Meal.hasOne(Order)
Order.belongsTo(Meal)

Restaurant.hasMany(Meal)
Meal.belongsTo(Restaurant)

Restaurant.hasMany(Review)
Review.belongsTo(Restaurant)

User.hasMany(Review)
Review.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

db.sync()
  .then(() => console.log('Database sync'))
  .catch((err) => console.log(err))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`app listening on http://localhost:${PORT}!!`)
})
