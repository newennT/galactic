// models/user.js

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: { 
        type: DataTypes.STRING(50), 
        allowNull: false, 
        unique: {
            args: true,
            msg: "Le pseudo doit être unique"
        },
        validate: {
            notEmpty: {
                msg: "Le pseudo est obligatoire"
            },
            notNull: {
                msg: "Le pseudo est obligatoire"
            },
            len: {
                args: [3, 50],
                msg: "Le pseudo doit avoir entre 3 et 50 caractères"
            }
        }
    },
    email: { 
        type: DataTypes.STRING(255), 
        allowNull: false, 
        unique: {
            args: true,
            msg: "L'email doit être unique"
        },
        validate: {
            notEmpty: {
                msg: "L'email est obligatoire"
            },
            notNull: {
                msg: "L'email est obligatoire"
            },
            isEmail: {
                msg: "L'email doit être valide"
            }
        }
    },
    password: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
    },
    is_admin: { 
        type: DataTypes.BOOLEAN, 
        allowNull: true,
        defaultValue: false
    },
    last_login: { 
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
  }, { 
    timestamps: true,
    defaultScope: {
        attributes: { exclude: ['password'] }
    }, 
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      },

      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  }
);

  User.associate = models => {
    User.belongsToMany(models.Chapter, { through: models.UserChapter, foreignKey: 'id_user' });
    User.belongsToMany(models.Exercise, { through: models.UserExercise, foreignKey: 'id_user' });
  };

  User.prototype.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};