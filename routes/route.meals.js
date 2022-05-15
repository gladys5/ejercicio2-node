const express = require('express');
const router = express.Router();

const {
  newMealById,
  getMealThatIsActive,
  getMealById,
  updateMeal,
  disable,
} = require('../controllers/controller.meals');
router.post('/:id', newMealById);

router.get('/', getMealThatIsActive);

router.get('/:id', getMealById);

router.patch('/:id', updateMeal);

router.delete('/:id', disable);

module.exports = { MealRouter: router };
