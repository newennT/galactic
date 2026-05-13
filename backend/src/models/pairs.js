// models/pairs.js

module.exports = (sequelize, DataTypes) => {
    const Pairs = sequelize.define('Pairs', {
        id_response: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.STRING(100),
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
        pair_key: {
            type: DataTypes.STRING(1),
            allowNull: false
        },
        id_page: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    Pairs.associate = models => {
        Pairs.belongsTo(models.Exercise, { foreignKey: 'id_page' });
    };

    async function validatePairsExercise(Exercise, id_page) {
        const exercise = await Exercise.findByPk(id_page);
        if (!exercise) throw new Error("Exercise not found");
        if (exercise.type !== 'PAIRS') throw new Error("Cet exercice n'est pas de type PAIRS");
    }

    async function validatePairsHook(pairs, options) {
        const Exercise = options?.models?.Exercise || sequelize.models.Exercise;
        if (!Exercise) { throw new Error("Modèle Exercise introuvable"); }
        await validatePairsExercise(Exercise, pairs.id_page);
    }

    Pairs.beforeCreate(validatePairsHook);
    Pairs.beforeUpdate(validatePairsHook);
    
    return Pairs;
};