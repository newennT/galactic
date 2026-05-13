const definePutInOrder = require('../../src/models/putInOrder');

describe('PutInOrder model', () => {
  let sequelize;
  let PutInOrder;
  let beforeCreateHook;
  let beforeUpdateHook;

  beforeEach(() => {
    beforeCreateHook = null;
    beforeUpdateHook = null;

    sequelize = {
      models: {},

      define: jest.fn((name, attributes, options) => {
        const model = {
          name,
          attributes,
          options,

          belongsTo: jest.fn(),

          beforeCreate: jest.fn((hook) => {
            beforeCreateHook = hook;
          }),

          beforeUpdate: jest.fn((hook) => {
            beforeUpdateHook = hook;
          }),
        };

        return model;
      }),
    };

    const DataTypes = {
      INTEGER: 'INTEGER',
      TEXT: 'TEXT',
    };

    PutInOrder = definePutInOrder(sequelize, DataTypes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  describe('model definition', () => {
    test('should define id_response', () => {
      expect(PutInOrder.attributes.id_response).toEqual({
        type: 'INTEGER',
        primaryKey: true,
        autoIncrement: true,
      });
    });

    test('should define content validation', () => {
      expect(PutInOrder.attributes.content.allowNull).toBe(false);

      expect(PutInOrder.attributes.content.validate.notEmpty.msg).toBe('Le contenu est obligatoire');

      expect(PutInOrder.attributes.content.validate.notNull.msg).toBe('Le contenu est obligatoire');
    });

    test('should define ordering fields', () => {
      expect(PutInOrder.attributes.mixed_order.allowNull).toBe(false);
      expect(PutInOrder.attributes.correct_order.allowNull).toBe(false);
    });

    test('should define id_page', () => {
      expect(PutInOrder.attributes.id_page.allowNull).toBe(false);
    });
  });

 
  describe('beforeCreate hook', () => {
    test('should throw if Exercise model missing', async () => {
      sequelize.models.Exercise = undefined;

      await expect(
        beforeCreateHook({ id_page: 1 }, {})
      ).rejects.toThrow('Modèle Exercise introuvable');
    });

    test('should throw if exercise not found', async () => {
      const ExerciseMock = {
        findByPk: jest.fn().mockResolvedValue(null),
      };

      await expect(
        beforeCreateHook(
          { id_page: 1 },
          { models: { Exercise: ExerciseMock } }
        )
      ).rejects.toThrow('Exercise not found');
    });

    test('should reject if type is not ORDER', async () => {
      const ExerciseMock = {
        findByPk: jest.fn().mockResolvedValue({
          type: 'PAIRS',
        }),
      };

      await expect(
        beforeCreateHook(
          { id_page: 1 },
          { models: { Exercise: ExerciseMock } }
        )
      ).rejects.toThrow(
        "Cet exercice n'est pas de type ORDER"
      );
    });

    test('should allow valid ORDER creation', async () => {
      const ExerciseMock = {
        findByPk: jest.fn().mockResolvedValue({
          type: 'ORDER',
        }),
      };

      await expect(
        beforeCreateHook(
          { id_page: 1 },
          { models: { Exercise: ExerciseMock } }
        )
      ).resolves.not.toThrow();

      expect(ExerciseMock.findByPk).toHaveBeenCalledWith(1);
    });
  });


  describe('beforeUpdate hook', () => {
    test('should throw if Exercise model missing', async () => {
      sequelize.models.Exercise = undefined;

      await expect(
        beforeUpdateHook({ id_page: 1 }, {})
      ).rejects.toThrow('Modèle Exercise introuvable');
    });

    test('should allow valid ORDER update', async () => {
      const ExerciseMock = {
        findByPk: jest.fn().mockResolvedValue({
          type: 'ORDER',
        }),
      };

      await expect(
        beforeUpdateHook(
          { id_page: 1 },
          { models: { Exercise: ExerciseMock } }
        )
      ).resolves.not.toThrow();
    });

    test('should reject invalid type on update', async () => {
      const ExerciseMock = {
        findByPk: jest.fn().mockResolvedValue({
          type: 'UNIQUE',
        }),
      };

      await expect(
        beforeUpdateHook(
          { id_page: 1 },
          { models: { Exercise: ExerciseMock } }
        )
      ).rejects.toThrow(
        "Cet exercice n'est pas de type ORDER"
      );
    });
  });


  describe('associations', () => {
    test('should define belongsTo Exercise', () => {
      const models = {
        Exercise: {},
      };

      PutInOrder.associate(models);

      expect(PutInOrder.belongsTo).toHaveBeenCalledWith(
        models.Exercise,
        { foreignKey: 'id_page' }
      );
    });
  });
});