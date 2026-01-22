// models/lesson.js
module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    id_page: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    lesson: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'lesson',
    timestamps: false
  });

  Lesson.associate = models => {
    Lesson.belongsTo(models.Page, { foreignKey: 'id_page', as: 'page' });
  };

  return Lesson;
};