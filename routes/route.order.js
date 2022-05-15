const express = require('express');
const router = express.Router();

const {
  newOrder,
  getOrderOfOneUser,
  orderWhitStatusActive,
  orderWhitStatusCansel,
} = require('../controllers/controller.orders');

router.post('/', newOrder);

router.get('/:me', getOrderOfOneUser);

router.patch('/:id', orderWhitStatusActive);

router.delete('/:id', orderWhitStatusCansel);

module.exports = { OrderRouter: router };
