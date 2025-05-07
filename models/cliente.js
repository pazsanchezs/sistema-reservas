module.exports = (sequelize, DataTypes) => {
    const Cliente = sequelize.define('Cliente', {
      cedula: {
        type: DataTypes.STRING,
        unique: true
      },
      nombre: DataTypes.STRING,
      apellido: DataTypes.STRING
    });
  
    Cliente.associate = (models) => {
      Cliente.hasMany(models.Reserva, { foreignKey: 'id_cliente' });
    };
  
    return Cliente;
  };
  