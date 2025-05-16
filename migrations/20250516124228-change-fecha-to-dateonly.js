'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Reservas', 'fechaIngreso', {
      type: Sequelize.DATEONLY,
      allowNull: false
    });
    await queryInterface.changeColumn('Reservas', 'fechaSalida', {
      type: Sequelize.DATEONLY,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Reservas', 'fechaIngreso', {
      type: Sequelize.DATE,
      allowNull: false
    });
    await queryInterface.changeColumn('Reservas', 'fechaSalida', {
      type: Sequelize.DATE,
      allowNull: false
    });
  }
};
