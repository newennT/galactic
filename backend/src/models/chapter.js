
// models/chapter.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Chapter", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        abstract: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isPublished: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        timestamps: true
    })
}