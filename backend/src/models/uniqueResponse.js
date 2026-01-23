// models/uniqueResponse.js

module.exports = (sequelize, DataTypes) => {
    const UniqueResponse = sequelize.define('UniqueResponse', {
        id_response: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        is_correct: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        timestamps: true
    });

    UniqueResponse.associate = models => {
        UniqueResponse.belongsTo(models.Exercise, { foreignKey: 'id_page' });
    };

    return UniqueResponse;
};