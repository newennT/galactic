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

    async function validateUniqueResponseExercise(Exercise, id_page) {
        const exercise = await Exercise.findByPk(id_page);
        if (!exercise) throw new Error("Exercise not found");
        if (exercise.type !== 'UNIQUE') throw new Error("Cet exercice n'est pas de type UNIQUE");
    }

    async function validateUniqueResponseHook(uniqueResponse, options) {
        const Exercise = options?.models?.Exercise || sequelize.models.Exercise;
        if (!Exercise) { throw new Error("Modèle Exercise introuvable"); }
        await validateUniqueResponseExercise(Exercise, uniqueResponse.id_page);
    }

    UniqueResponse.beforeCreate(validateUniqueResponseHook);
    UniqueResponse.beforeUpdate(validateUniqueResponseHook);

    return UniqueResponse;
};