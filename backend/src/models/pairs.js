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

    Pairs.beforeCreate(async (pair) => {
        const Exercise = sequelize.models.Exercise;
        const exercise = await Exercise.findByPk(pair.id_page);
        if (!exercise) throw new Error("Exercice non trouvé");
        if (exercise.type !== "PAIRS") {
        throw new Error("Impossible de créer un Pairs sur un exercice qui n'est pas de type PAIRS");
        }
    });

    Pairs.beforeUpdate(async (pair) => {
        const Exercise = sequelize.models.Exercise;
        const exercise = await Exercise.findByPk(pair.id_page);
        if (!exercise) throw new Error("Exercice non trouvé");
        if (exercise.type !== "PAIRS") {
        throw new Error("Impossible de modifier un Pairs sur un exercice qui n'est pas de type PAIRS");
        }
    });

    return Pairs;
};