const express = require('express')

const {
  createUserValidators,
  checkResult,
  validateEmailAndPassword,
} = require('../midellwares/validators.middleware')
const {
  protectToken,
  protectAccount,
  userExist,
  checkExistEmail,
  isRole,
  validPassowrd,
  existOrderForUser,
  checkUserId,
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
const router = express.Router()

router.post('/signup', createUserValidators, createUsers)
router.post('/login', logins)
router.get('/', getAll)
router.use(protectToken)
router.get('/orders/:id', getOrderById)
router.get('/orders', getOrderOfUser)

router.patch(
  '/:id',

  checkUserId,
  protectAccount,
  updateUser
)
router.delete('/:id', checkUserId, protectAccount, desabilityUser)

module.exports = { UserRouter: router }
