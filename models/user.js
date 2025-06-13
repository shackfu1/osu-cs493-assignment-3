const { DataTypes } = require('sequelize')

const bcrypt = require('bcryptjs');
const sequelize = require('../lib/sequelize')

const User = sequelize.define('user', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  password: {
    type: DataTypes.STRING,
    set(value) {
      const hashedPassword = bcrypt.hashSync(value, 8);
      this.setDataValue('password', hashedPassword);
    },
  },
  admin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
})

exports.User = User

/*
 * Export an array containing the names of fields the client is allowed to set
 * on businesses.
 */
exports.UserClientFields = [
  'name',
  'email',
  'password',
  'admin',
]
