
// models/level.js
module.exports = (sequelize, DataTypes) => {
    const Level = sequelize.define("Level", {
        id_level: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "Le titre du niveau doit être unique"
            },
            validate: {
                notNull: {
                    msg: "Le titre du niveau est obligatoire"
                },
                notEmpty: {
                    msg: "Le titre du niveau est obligatoire"
                }
            }
        }
    }, {
        timestamps: true
    });

    Level.associate = models => {
        Level.belongsToMany(models.Chapter, { through: models.ChapterLevel, foreignKey: 'id_level' });
    };

    return Level;
}