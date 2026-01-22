// models/PutInOrder.js
module.exports = (sequelize, DataTypes) => {
    const PutInOrder = sequelize.define('PutInOrder', {
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
        mixed_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        correct_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        }
    }, {
        timestamps: false
    });     

    PutInOrder.associate = models => {
        PutInOrder.belongsTo(models.CategoryExercise, { foreignKey: 'id_type', as: 'type' });
    };

    return PutInOrder;
}