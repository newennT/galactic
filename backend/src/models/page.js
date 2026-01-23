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
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_chapter: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
        type: DataTypes.ENUM('LESSON', 'EXERCISE'),
        allowNull: false
    }
  }, {
    timestamps: true
  });

  Page.associate = models => {
    Page.hasOne(models.Lesson, { foreignKey: 'id_page', onDelete: 'CASCADE' });
    Page.hasOne(models.Exercise, { foreignKey: 'id_page', onDelete: 'CASCADE' });
    Page.belongsTo(models.Chapter, { foreignKey: 'id_chapter' });
  };

  return Page;
};
