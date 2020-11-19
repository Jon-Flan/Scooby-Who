/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    //everytime an ID need to be made public, as a link or printed on the screen we'll use UUID to prevent spoofing
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: true
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: true,
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notNull: true
      }
    },
    //C for a customer of B for a breeder
    user_type: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: 'C'
    },
    //this field will be null as default...after user confirms the e-mail via a link, then it'll contain the timestamp of when that happened
    validated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isNull: true
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: true
    },
    //for softdeletes
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at',
      allowNull: true
    }
  }, {
    sequelize,
    paranoid: true,
    tableName: 'users',
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
