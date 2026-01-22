// models/page.js
module.exports = (sequelize, DataTypes) => {
  const CategoryExercise = sequelize.define('CategoryExercise', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    timestamps: false
  });

  CategoryExercise.associate = models => {
    CategoryExercise.hasMany(models.Exercise, { foreignKey: 'id_category', as: 'exercises' });
    CategoryExercise.hasMany(models.UniqueResponse, { foreignKey: 'id_type' });
    CategoryExercise.hasMany(models.Pairs, { foreignKey: 'id_type' });
    CategoryExercise.hasMany(models.PutInOrder, { foreignKey: 'id_type' });
  };

  return CategoryExercise;
};
