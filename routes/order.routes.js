const express = require('express')
const router = express.Router()

const {
  newOrder,
  getOrderOfOneUser,
  orderWhitStatusActive,
  orderWhitStatusCansel,
} = require('../controllers/controller.orders')
const { protectToken, isAdmin } = require('../midellwares/user.middleware')

router.post('/', protectToken, newOrder)

router.get('/:me', isAdmin, getOrderOfOneUser)

router.patch('/:id', isAdmin, orderWhitStatusActive)

router.delete('/:id', isAdmin, orderWhitStatusCansel)

module.exports = { OrderRouter: router }
