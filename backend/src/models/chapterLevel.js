// models/chapterLevel.js
module.exports = (sequelize, DataTypes) => {
    const ChapterLevel = sequelize.define('ChapterLevel', {
        id_level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        id_chapter: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        }
    }, {
        timestamps: true
    });

    ChapterLevel.associate = models => {
        ChapterLevel.belongsTo(models.Level, { foreignKey: 'id_level' });
        ChapterLevel.belongsTo(models.Chapter, { foreignKey: 'id_chapter' });
    };

    return ChapterLevel;
};