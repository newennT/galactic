// models/pairs.js

module.exports = (sequelize, DataTypes) => {
    const Pairs = sequelize.define('Pairs', {
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
        key: {
            type: DataTypes.STRING(1),
            allowNull: false
        }
    }, {
        timestamps: false
    });

    Pairs.associate = models => {
        Pairs.belongsTo(models.CategoryExercise, { foreignKey: 'id_type', as: 'type' });
    };

    return Pairs;
};