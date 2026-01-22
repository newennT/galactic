
// models/chapter.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Chapter", {
        id: {
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
    })
}