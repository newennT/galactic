// models/userChapter.js
module.exports = (sequelize, DataTypes) => {
    const UserChapter = sequelize.define('UserChapter', {
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        id_chapter: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        last_chapter_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true
    }
    );

    UserChapter.associate = models => {
        UserChapter.belongsTo(models.User, { foreignKey: 'id_user' });
        UserChapter.belongsTo(models.Chapter, { foreignKey: 'id_chapter' });
    };

    return UserChapter;
}