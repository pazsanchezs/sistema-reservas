'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Habitacions', 'posicion_x', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('Habitacions', 'posicion_y', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Habitacions', 'posicion_x');
    await queryInterface.removeColumn('Habitacions', 'posicion_y');
  }
};
