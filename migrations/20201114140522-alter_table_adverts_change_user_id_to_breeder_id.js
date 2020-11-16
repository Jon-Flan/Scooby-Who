'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
        await queryInterface.addColumn('adverts', 'breeder_id', {
            type: Sequelize.DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'breeders',
                key: 'id'
            },
            after: 'id'
        });
        await queryInterface.removeColumn('adverts', 'user_id');
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
      await queryInterface.addColumn('adverts', 'user_id', {
          type: Sequelize.DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
              model: 'users',
              key: 'id'
          },
          after: 'id'
      });
      await queryInterface.removeColumn('adverts', 'breeder_id');
  }
};
