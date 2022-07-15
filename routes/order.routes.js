const express = require('express')
const router = express.Router()

const {
  newOrder,
  getOrderOfOneUser,
  orderWhitStatusActive,
  orderWhitStatusCansel,
} = require('../controllers/controller.orders')
const { existMealForOrder } = require('../midellwares/meal.middleware')
const {
  protectToken,
  isAdmin,
  protectAccount,
} = require('../midellwares/user.middleware')
const { checkResult } = require('../midellwares/validators.middleware')

router.post('/', protectToken, checkResult, existMealForOrder, newOrder)

router.get('/me', protectToken, getOrderOfOneUser)

router.patch('/:id', protectToken, orderWhitStatusActive)

router.delete('/:id', isAdmin, orderWhitStatusCansel)

module.exports = { OrderRouter: router }
