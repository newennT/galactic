// models/page.js
module.exports = (sequelize, DataTypes) => {
  const Page = sequelize.define('Page', {
    id_page: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    id_chapter: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
        type: DataTypes.ENUM('lesson', 'exercise'),
        allowNull: false
        }
  }, {
    timestamps: false
  });

  Page.associate = models => {
    Page.hasOne(models.Lesson, { foreignKey: 'id_page', as: 'lesson' });
    Page.hasOne(models.Exercise, { foreignKey: 'id_page', as: 'exercise' });
    Page.belongsTo(models.Chapter, { foreignKey: 'id_chapter', as: 'chapter' });
  };

  return Page;
};
