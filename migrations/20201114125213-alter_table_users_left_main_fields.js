var Sequelize = require('sequelize');
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
        await queryInterface.addColumn('users', 'user_type', {
            type: Sequelize.DataTypes.STRING(1),
            allowNull: false,
            default: 'C',
            after: 'password'
        });
        await queryInterface.removeColumn('users', 'mobile_phone');
        await queryInterface.removeColumn('users', 'name');
        await queryInterface.removeColumn('users', 'surname');
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
      await queryInterface.removeColumn('users', 'user_type');
      await queryInterface.addColumn('users', 'surname', {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: false,
          after: 'email',
          validate: {
              notNull: true
          }
      });
      await queryInterface.addColumn('users', 'name', {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: false,
          after: 'email',
          validate: {
              notNull: true
          }
      });
      await queryInterface.addColumn('users', 'mobile_phone', {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: false,
          after: 'email',
          validate: {
              notNull: true
          }
      });
  }
};
