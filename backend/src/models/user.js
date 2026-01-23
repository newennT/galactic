// models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pseudo: { 
        type: DataTypes.STRING(50), 
        allowNull: false, 
        unique: true 
    },
    email: { 
        type: DataTypes.STRING(255), 
        allowNull: false, 
        unique: true 
    },
    password_hash: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
    },
    is_admin: { 
        type: DataTypes.BOOLEAN, 
        allowNull: false,
        defaultValue: false
    },
    last_login: { 
        type: DataTypes.DATE, 
        allowNull: false 
    }
  }, { 
    timestamps: true 
});

  User.associate = models => {
    User.belongsToMany(models.Chapter, { through: models.UserChapter, foreignKey: 'id_user' });
    User.belongsToMany(models.Exercise, { through: models.UserExercise, foreignKey: 'id_user' });
  };

  return User;
};