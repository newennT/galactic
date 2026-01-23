// models/lesson.js
module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    id_page: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Le titre est obligatoire"
        },
        notNull: {
          msg: "Le titre est obligatoire"
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Le contenu est obligatoire"
        },
        notNull: {
          msg: "Le contenu est obligatoire"
        }
      }
    }
  }, {
    timestamps: true
  });

  Lesson.associate = models => {
    Lesson.belongsTo(models.Page, { foreignKey: 'id_page', as: 'page' });
  };

  return Lesson;
};