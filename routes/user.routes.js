const express = require('express')

const {
  createUserValidators,
  checkResult,
} = require('../midellwares/validators.middleware')
const {
  protectToken,
  protectAccount,
  existUser,
} = require('../midellwares/user.middleware')

const {
  createUsers,
  logins,
  updateUser,
  desabilityUser,
  getOrderOfUser,
  getOrderById,
  getAll,
} = require('../controllers/controller.users')
const { orderExistByUser } = require('../midellwares/orderExist.middleware')
const router = express.Router()

router.post('/signup', createUsers)
router.post('/login', logins)
router.get('/', getAll)
router.use(protectToken)
router.get('/orders/:id', orderExistByUser, getOrderById)
router.get('/orders', orderExistByUser, getOrderOfUser)

router.patch('/:id', updateUser)
router.delete('/:id', desabilityUser)

module.exports = { UserRouter: router }
