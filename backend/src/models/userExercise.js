// models/UserExercise.js

module.exports = (sequelize, DataTypes) => {
    const UserExercise = sequelize.define('UserExercise', {
        id_page: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        id_user: {
            type: DataTypes.INTEGER,
            primaryKey: true
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
        timestamps: false
    });

    return UserExercise;
};