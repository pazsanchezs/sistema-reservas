module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Eliminar las columnas 'posX' y 'posY'
    await queryInterface.removeColumn('Habitacions', 'posX');
    await queryInterface.removeColumn('Habitacions', 'posY');
  },

  down: async (queryInterface, Sequelize) => {
    // Si necesitas revertir la migración, puedes volver a agregar las columnas aquí
    await queryInterface.addColumn('Habitacions', 'posX', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn('Habitacions', 'posY', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};
