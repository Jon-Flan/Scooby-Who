'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.addColumn('breeders', 'city', {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            after: 'address_2'
      });
      await queryInterface.addColumn('breeders', 'documentation', {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            after: 'registration_number'
      });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('breeders', 'city');
    await queryInterface.removeColumn('breeders', 'documentation');
  }
};
