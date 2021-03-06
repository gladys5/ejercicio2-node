const express = require('express')
const { check } = require('express-validator')
const {
  ratingParameter,
  existRestaurantId,
  chechExistRestaurant,
  existReview,
} = require('../midellwares/restaurant.middleware')
const {
  userExist,
  isAdmin,
  protectToken,
  protectAccount,
} = require('../midellwares/user.middleware')
const {
  checkResult,
  createUserValidators,
} = require('../midellwares/validators.middleware')
const {
  createNewRestaurant,
  getRestaurantActive,
  getRestaurantById,
  updateRestaurant,
  desabilityRestaurant,
  reviewOfRestaurant,
  updateReview,
  reviewDown,
} = require('../controllers/controller.restaurants')

const router = express.Router()

router.get('/', getRestaurantActive)

router.get('/:id', getRestaurantById)
router.use(protectToken)
router.post(
  '/reviews/:id',
  [
    check('comment', 'the comment is require').not().isEmpty(),
    checkResult,
    ratingParameter,
    chechExistRestaurant,
  ],
  reviewOfRestaurant
)

router.patch(
  'reviews/:id',
  checkResult,
  ratingParameter,
  existRestaurantId,
  existReview,
  updateReview
)

router.delete(
  '/reviews/:id',
  isAdmin,
  chechExistRestaurant,

  reviewDown
)
router.post(
  '/',
  [
    check('name', 'please add name').not().isEmpty(),
    check('address', 'please add address').not().isEmpty(),
  ],
  createNewRestaurant
)

router.patch('/:id', isAdmin, updateRestaurant)

router.delete('/:id', isAdmin, desabilityRestaurant)

module.exports = { RestaurantRouter: router }
