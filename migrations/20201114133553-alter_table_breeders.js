'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
        await queryInterface.addColumn('breeders', 'name', {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            after: 'user_id'
        });
        await queryInterface.addColumn('breeders', 'surname', {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            after: 'name'
        });
        await queryInterface.addColumn('breeders', 'mobile_phone', {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            after: 'surname'
        });
        await queryInterface.addColumn('breeders', 'kennel_name', {
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
      await queryInterface.removeColumn('breeders', 'name');
      await queryInterface.removeColumn('breeders', 'surname');
      await queryInterface.removeColumn('breeders', 'mobile_phone');
      await queryInterface.removeColumn('breeders', 'kennel_name');
  }
};
