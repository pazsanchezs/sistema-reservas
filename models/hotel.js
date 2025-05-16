module.exports = (sequelize, DataTypes) => {
  const Hotel = sequelize.define('Hotel', {
    nombre: DataTypes.STRING,
    direccion: DataTypes.STRING
  });

  Hotel.associate = (models) => {
    Hotel.hasMany(models.Habitacion, { foreignKey: 'HotelId', as: 'hotel' });
    Hotel.hasMany(models.Reserva, { foreignKey: 'HotelId' });
  };

  return Hotel;
};
