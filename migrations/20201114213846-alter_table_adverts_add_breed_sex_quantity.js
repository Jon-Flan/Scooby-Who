'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
        await queryInterface.addColumn('adverts', 'breed', {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            after: 'body'
        });
        await queryInterface.addColumn('adverts', 'sex', {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            after: 'breed'
        });
        await queryInterface.addColumn('adverts', 'actual_quantity', {
            type: Sequelize.DataTypes.SMALLINT.UNSIGNED,
            allowNull: false,
            after: 'sex'
        });
        await queryInterface.addColumn('adverts', 'original_quantity', {
            type: Sequelize.DataTypes.SMALLINT.UNSIGNED,
            allowNull: false,
            after: 'actual_quantity'
        });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
      await queryInterface.removeColumn('adverts', 'breed');
      await queryInterface.removeColumn('adverts', 'sex');
      await queryInterface.removeColumn('adverts', 'actual_quantity');
      await queryInterface.removeColumn('adverts', 'original_quantity');
  }
};
