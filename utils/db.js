const { Sequelize } = require('sequelize')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const db = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  logging: false,
  dialectOptions: {
    useUTC: false,
  },
  timezone: '-06:00',
})
module.exports = { db }
