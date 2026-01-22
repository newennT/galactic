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
        type: DataTypes.STRING(50), 
        allowNull: false, 
        unique: true 
    },
    password_hash: { 
        type: DataTypes.STRING(50), 
        allowNull: false 
    },
    role: { 
        type: DataTypes.STRING(50), 
        allowNull: false 
    },
    created_at: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
    last_login: { 
        type: DataTypes.DATE, 
        allowNull: false 
    }
  }, { 
    timestamps: false 
});

  User.associate = models => {
    User.belongsToMany(models.Chapter, { through: models.UserChapter, foreignKey: 'id_user' });
    User.belongsToMany(models.Exercise, { through: models.UserExercise, foreignKey: 'id_user' });
  };

  return User;
};