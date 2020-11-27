/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('breeders', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
    surname: {
          type: DataTypes.STRING(255),
          allowNull: false
    },
    mobile_phone: {
          type: DataTypes.STRING(255),
          allowNull: false
    },
    address_1: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    address_2: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    county: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    post_code: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    kennel_name: {
          type: DataTypes.STRING(255),
          allowNull: false
    },
    //registration number is provided by the government and must match submitted documents
    registration_number: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    //will point to the uploaded document to proof that breeder is registered in the country
    documentation: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    //timestamp of when the documents were confirmed, while NULL breeder won't be able to save ads
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'breeders',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "breeders_user_id_index",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
