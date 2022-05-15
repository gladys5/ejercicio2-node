const { DataTypes } = require('sequelize');

const { db } = require('../utils/db');

const Review = db.define('review', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ranting: {
    type: DataTypes.INTEGER,
    allowNull: false,
    
  },
});

module.exports = { Review };
