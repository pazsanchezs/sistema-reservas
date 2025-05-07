module.exports = (sequelize, DataTypes) => {
  const Reserva = sequelize.define('Reserva', {
    hotelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_hotel'
    },
    habitacionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_habitacion'
    },
    fecha_ingreso: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fecha_salida: {
      type: DataTypes.DATE,
      allowNull: false
    },
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_cliente'
    },
    cantidad_personas: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Reserva.associate = (models) => {
    Reserva.belongsTo(models.Hotel, { foreignKey: 'hotelId' });
    Reserva.belongsTo(models.Habitacion, { foreignKey: 'habitacionId' });
    Reserva.belongsTo(models.Cliente, { foreignKey: 'clienteId' });
  };

  return Reserva;
};
