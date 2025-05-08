module.exports = (sequelize, DataTypes) => {
  const Reserva = sequelize.define('Reserva', {
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_salida: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    cantidad_personas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1
      }
    },
    ClienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Clientes',
        key: 'id'
      }
    },
    HotelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Hotels',
        key: 'id'
      }
    },
    HabitacionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Habitacions',
        key: 'id'
      }
    }
  });

  Reserva.associate = (models) => {
    Reserva.belongsTo(models.Cliente, { foreignKey: 'ClienteId' });
    Reserva.belongsTo(models.Hotel, { foreignKey: 'HotelId' });
    Reserva.belongsTo(models.Habitacion, { foreignKey: 'HabitacionId' });
  };

  return Reserva;
};
