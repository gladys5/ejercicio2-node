

const { DataTypes } = require('sequelize');
const { db } = require('../utils/db');

const User = db.define('user', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'normal',
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
    accountNumber:{
      type: DataTypes.INTEGER
    }
  },
});

module.exports = { User };
