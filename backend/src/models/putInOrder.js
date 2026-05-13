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

    async function validatePutInOrderExercise(Exercise, id_page) {
        const exercise = await Exercise.findByPk(id_page);
        if (!exercise) throw new Error("Exercise not found");
        if (exercise.type !== 'ORDER') throw new Error("Cet exercice n'est pas de type ORDER");
    }

    async function validatePutInOrderHook(putInOrder, options) {
        const Exercise = options?.models?.Exercise || sequelize.models.Exercise;
        if (!Exercise) { throw new Error("Modèle Exercise introuvable"); }
        await validatePutInOrderExercise(Exercise, putInOrder.id_page);
    }

    PutInOrder.beforeCreate(validatePutInOrderHook);
    PutInOrder.beforeUpdate(validatePutInOrderHook);

    return PutInOrder;
}