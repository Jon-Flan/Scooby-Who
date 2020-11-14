'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
        await queryInterface.addColumn('customers', 'name', {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            after: 'user_id'
        });
        await queryInterface.addColumn('customers', 'surname', {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            after: 'name'
        });
        await queryInterface.addColumn('customers', 'mobile_phone', {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            after: 'surname'
        });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
      await queryInterface.removeColumn('customers', 'name');
      await queryInterface.removeColumn('customers', 'surname');
      await queryInterface.removeColumn('customers', 'mobile_phone');
  }
};
