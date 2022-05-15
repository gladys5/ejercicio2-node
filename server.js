const { app } = require('./app');
const { db } = require('./utils/db');
const { User } = require('./models/model.user');
const { Meal } = require('./models/model.meal');
const { Order } = require('./models/model.order');
const { Restaurant } = require('./models/model.restaurant');
const { Review } = require('./models/model.Review');
db.authenticate()

  .then(() => console.log('db is ready'))

  .catch((err) => console.log('db not found', err));

db.sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.log(err));

Order.hasOne(Meal);
Meal.belongsTo(Order);

Restaurant.hasMany(Meal);
Meal.belongsTo(Restaurant);

User.hasMany(Review);
Review.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`app listening on http://localhost:${PORT}!!`);
});
