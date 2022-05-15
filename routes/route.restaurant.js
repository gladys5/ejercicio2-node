const express = require('express');
const router = express.Router();

const {
  createNewRestaurant,
  getRestaurantActive,
  getRestaurantById,
  updateRestaurant,
  desabilityRestaurant,
  reviewOfRestaurant,
  updateReview,
  reviewDown,
} = require('../controllers/controller.restaurants');


router.post('/',createNewRestaurant);

router.get('/', getRestaurantActive);

router.get('/:id', getRestaurantById);

router.patch('/:id', updateRestaurant);

router.delete('/:id', desabilityRestaurant);

router.post('/reviews/:id', reviewOfRestaurant);

router.patch('/reviews/:id', updateReview);

router.delete('/reviews/:id', reviewDown);

module.exports = { RestaurantRouter: router };
