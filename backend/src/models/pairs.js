// models/pairs.js

module.exports = (sequelize, DataTypes) => {
    const Pairs = sequelize.define('Pairs', {
        id_response: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        pair_key: {
            type: DataTypes.STRING(1),
            allowNull: false
        },
        id_page: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_page: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    Pairs.associate = models => {
        Pairs.belongsTo(models.Exercise, { foreignKey: 'id_page' });
    };

    return Pairs;
};