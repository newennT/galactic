
// models/chapter.js
module.exports = (sequelize, DataTypes) => {
    const Chapter = sequelize.define("Chapter", {
        id_chapter: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "Le titre du chapitre doit être unique"
            },
            validate: {
                notNull: {
                    msg: "Le titre du chapitre est obligatoire"
                },
                notEmpty: {
                    msg: "Le titre du chapitre est obligatoire"
                }
            }
        },
        title_fr: {
            type: DataTypes.STRING,
            allowNull: true
        },
        abstract: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "L'abstract du chapitre est obligatoire"
                },
                notEmpty: {
                    msg: "L'abstract du chapitre est obligatoire"
                }
            }
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isPublished: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        timestamps: true
    });

    Chapter.associate = models => {
        Chapter.hasMany(models.Page, { foreignKey: 'id_chapter', onDelete: 'CASCADE' });
        Chapter.belongsToMany(models.Level, { through: models.ChapterLevel, foreignKey: 'id_chapter' });
        Chapter.belongsToMany(models.User, { through: models.UserChapter, foreignKey: 'id_chapter' });
  };

    return Chapter;
}