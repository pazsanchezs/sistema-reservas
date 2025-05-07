'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Habitacions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numero: {
        type: Sequelize.STRING
      },
      posX: {
        type: Sequelize.INTEGER
      },
      posY: {
        type: Sequelize.INTEGER
      },
      piso: {
        type: Sequelize.STRING
      },
      capacidad: {
        type: Sequelize.INTEGER
      },
      caracteristicas: {
        type: Sequelize.TEXT
      },
      HotelId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Habitacions');
  }
};