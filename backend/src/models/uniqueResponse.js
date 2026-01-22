// models/UniqueResponse.js

module.exports = (sequelize, DataTypes) => {
    const UniqueResponse = sequelize.define('UniqueResponse', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        id_type: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        content: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        is_correct: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    UniqueResponse.associate = models => {
        UniqueResponse.belongsTo(models.CategoryExercise, { foreignKey: 'id_type', as: 'type' });
    };

    return UniqueResponse;
};