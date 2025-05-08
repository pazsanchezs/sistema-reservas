module.exports = (sequelize, DataTypes) => {
  const Habitacion = sequelize.define('Habitacion', {
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    hotelId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'HotelId',
      references: {
        model: 'Hotels', 
        key: 'id'
      }
    },
    posicion_x: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    posicion_y: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    piso: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'PB'
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    caracteristicas: {
      type: DataTypes.TEXT,
      defaultValue: ''
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['numero', 'hotelId'] // Evita duplicados
      }
    ]
  });

  Habitacion.associate = (models) => {
    Habitacion.belongsTo(models.Hotel, { 
      foreignKey: 'HotelId',
      as: 'hotel'
    });
    Habitacion.hasMany(models.Reserva, { 
      foreignKey: 'habitacionId',
      as: 'reservas'
    });
  };

  return Habitacion;
};
