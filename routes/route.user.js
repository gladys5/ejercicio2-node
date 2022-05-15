const express = require('express');


const router = express.Router();

const {
  createUser,
  logins,
  updateUser,
  desabilityUser,
  getOrderOfUser,
  getOrderById,
} = require('../controllers/controller.users');

router.post('/signup', createUser);

router.post('/login',logins);

router.patch('/:id', updateUser);

router.delete('/:id', desabilityUser);

router.get('/', getOrderOfUser); 
router.get('/orders/:id',getOrderById);

module.exports = { UserRouter: router };
