// models/exercise.js
module.exports = (sequelize, DataTypes) => {
  const Exercise = sequelize.define('Exercise', {
    id_page: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La question est obligatoire"
        },
        notNull: {
          msg: "La question est obligatoire"
        }
      }
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Le feedback est obligatoire"
        },
        notNull: {
          msg: "Le feedback est obligatoire"
        }
      }
    },
    type: {
      type: DataTypes.ENUM('UNIQUE', 'PAIRS', 'ORDER'),
      allowNull: false
    }
  }, {
    timestamps: true
  });

  Exercise.associate = models => {
    Exercise.belongsTo(models.Page, { foreignKey: 'id_page' });
    Exercise.belongsToMany(models.User, { through: models.UserExercise, foreignKey: 'id_page' });
    Exercise.hasMany(models.UniqueResponse, { foreignKey: 'id_page', onDelete: 'CASCADE' });
    Exercise.hasMany(models.Pairs, { foreignKey: 'id_page', onDelete: 'CASCADE' });
    Exercise.hasMany(models.PutInOrder, { foreignKey: 'id_page', onDelete: 'CASCADE' });
  };

  return Exercise;
};
