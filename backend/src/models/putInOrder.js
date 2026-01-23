// modelspPutInOrder.js
module.exports = (sequelize, DataTypes) => {
    const PutInOrder = sequelize.define('PutInOrder', {
        id_response: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        mixed_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        correct_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_page: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true
    });     

    PutInOrder.associate = models => {
        PutInOrder.belongsTo(models.Exercise, { foreignKey: 'id_page' });
    };

    return PutInOrder;
}