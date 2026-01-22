// models/exercise.js
module.exports = (sequelize, DataTypes) => {
  const Exercise = sequelize.define('Exercise', {
    id_page: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    question: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'exercise',
    timestamps: false
  });

  Exercise.associate = models => {
    Exercise.belongsTo(models.Page, { foreignKey: 'id_page', as: 'page' });
    Exercise.belongsToMany(models.User, { through: models.UserExercise, foreignKey: 'id_page' });
    Exercise.belongsTo(models.CategoryExercise, { foreignKey: 'id_categorie', as: 'categorie' });
  };

  return Exercise;
};
