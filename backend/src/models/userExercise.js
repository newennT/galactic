// models/UserExercise.js

module.exports = (sequelize, DataTypes) => {
    const UserExercise = sequelize.define('UserExercise', {
        id_page: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        id_user: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        is_correct:{
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        is_done: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    }, {
        timestamps: true
    });

    UserExercise.associate = models => {
        UserExercise.belongsTo(models.User, { foreignKey: 'id_user' });
        UserExercise.belongsTo(models.Exercise, { foreignKey: 'id_page' });
    };

    return UserExercise;
};