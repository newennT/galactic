// models/uniqueResponse.js

module.exports = (sequelize, DataTypes) => {
    const UniqueResponse = sequelize.define('UniqueResponse', {
        id_response: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Le contenu est obligatoire"
                },
                notNull: {
                    msg: "Le contenu est obligatoire"
                }
            }
        },
        is_correct: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        id_page: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    UniqueResponse.associate = models => {
        UniqueResponse.belongsTo(models.Exercise, { foreignKey: 'id_page' });
    };

    UniqueResponse.beforeCreate(async (ur) => {
        const Exercise = sequelize.models.Exercise;
        const exercise = await Exercise.findByPk(ur.id_page);
        if (!exercise) throw new Error("Exercice non trouvé");
        if (exercise.type !== "UNIQUE") {
        throw new Error("Impossible de créer un UniqueResponse sur un exercice qui n'est pas de type UNIQUE");
        }
    });

    UniqueResponse.beforeUpdate(async (ur) => {
        const Exercise = sequelize.models.Exercise;
        const exercise = await Exercise.findByPk(ur.id_page);
        if (!exercise) throw new Error("Exercice non trouvé");
        if (exercise.type !== "UNIQUE") {
        throw new Error("Impossible de modifier un UniqueResponse sur un exercice qui n'est pas de type UNIQUE");
        }
    });

    return UniqueResponse;
};