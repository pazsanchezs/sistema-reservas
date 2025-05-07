module.exports = (sequelize, DataTypes) => {
  const Hotel = sequelize.define('Hotel', {
    nombre: DataTypes.STRING,
    direccion: DataTypes.STRING
  });

  Hotel.associate = (models) => {
    Hotel.hasMany(models.Habitacion, { foreignKey: 'id_hotel' });
    Hotel.hasMany(models.Reserva, { foreignKey: 'id_hotel' });
  };

  return Hotel;
};
