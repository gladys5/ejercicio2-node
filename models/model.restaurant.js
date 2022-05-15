const { DataTypes } = require("sequelize");
const { db } = require("../utils/db");

const Restaurant = db.define('restaurant', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'exist',
  },
  ranting: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = { Restaurant };
