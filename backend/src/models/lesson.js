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
    Lesson.belongsTo(models.Page, { foreignKey: 'id_page' });
  };

  Lesson.beforeCreate(async (lesson, options) => {
    const Page = sequelize.models.Page;
    const page = await Page.findByPk(lesson.id_page);
    if (!page) throw new Error("Page non trouvée");
    if (page.type !== 'LESSON') throw new Error("Cette page n'est pas de type LESSON");
  });

  return Lesson;
};