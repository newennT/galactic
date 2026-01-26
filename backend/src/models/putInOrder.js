// modelspPutInOrder.js
module.exports = (sequelize, DataTypes) => {
    const PutInOrder = sequelize.define('PutInOrder', {
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
        mixed_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        correct_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_page: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true
    });     

    PutInOrder.associate = models => {
        PutInOrder.belongsTo(models.Exercise, { foreignKey: 'id_page' });
    };

    PutInOrder.beforeCreate(async (p) => {
        const Exercise = sequelize.models.Exercise;
        const exercise = await Exercise.findByPk(p.id_page);
        if (!exercise) throw new Error("Exercice non trouvé");
        if (exercise.type !== "ORDER") {
        throw new Error("Impossible de créer un PutInOrder sur un exercice qui n'est pas de type ORDER");
        }
    });

    PutInOrder.beforeUpdate(async (p) => {
        const Exercise = sequelize.models.Exercise;
        const exercise = await Exercise.findByPk(p.id_page);
        if (!exercise) throw new Error("Exercice non trouvé");
        if (exercise.type !== "ORDER") {
        throw new Error("Impossible de modifier un PutInOrder sur un exercice qui n'est pas de type ORDER");
        }
    });

    return PutInOrder;
}