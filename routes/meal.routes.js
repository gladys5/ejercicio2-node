const express = require('express')
const { Router } = require('express')
const { check } = require('express-validator')
const { protectToken, isAdmin } = require('../midellwares/user.middleware')

const {
  existRestaurantId,
  chechExistRestaurant,
} = require('../midellwares/restaurant.middleware')

const {
  newMealById,
  getMealThatIsActive,
  getMealById,
  updateMeal,
  disable,
} = require('../controllers/controller.meals')
const { checkResult } = require('../midellwares/validators.middleware')
const { existMeal } = require('../midellwares/meal.middleware')
const router = Router()

router.get('/:id', existMeal, getMealById)

router.use(protectToken, isAdmin)

router.post(
  '/:id',
  [
    check('name', 'the name is require').not().isEmpty(),
    check('price', 'the price is require').not().isEmpty(),
    check('price', 'the price must be a number').not().isString(),
    checkResult,
    existRestaurantId,
  ],
  newMealById
)

router.patch(
  '/:id',
  [
    check('name', 'require the name').not().isEmpty(),
    check('price', 'require the price').not().isEmpty(),
    check('price', 'the price must be a number').not().isString(),
    checkResult,
    existMeal,
  ],
  updateMeal
)

router.delete('/:id', existMeal, disable)

module.exports = { MealRouter: router }
