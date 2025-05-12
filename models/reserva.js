module.exports = (sequelize, DataTypes) => {
  const Reserva = sequelize.define('Reserva', {
    fechaIngreso: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'fechaIngreso'
    },
    fechaSalida: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'fechaSalida'
    },
    cantidadPersonas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1
      },
      field: 'cantidadPersonas'
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
      field: 'HabitacionId',
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
