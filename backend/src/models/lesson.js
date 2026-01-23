// models/lesson.js
module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    id_page: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  Lesson.associate = models => {
    Lesson.belongsTo(models.Page, { foreignKey: 'id_page', as: 'page' });
  };

  return Lesson;
};