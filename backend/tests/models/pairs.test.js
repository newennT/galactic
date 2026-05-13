// tests/models/pairs.test.js

const definePairs = require('../../src/models/pairs');

describe('Pairs model', () => {
  let sequelize;
  let Pairs;
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
      STRING: (size) => ({
        type: 'STRING',
        size,
      }),
    };

    Pairs = definePairs(sequelize, DataTypes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('model definition', () => {
    test('should define id_response as primary key', () => {
      expect(Pairs.attributes.id_response).toEqual({
        type: 'INTEGER',
        primaryKey: true,
        autoIncrement: true,
      });
    });

    test('should define content field', () => {
      expect(Pairs.attributes.content.allowNull).toBe(false);

      expect(Pairs.attributes.content.validate.notEmpty.msg)
        .toBe('Le contenu est obligatoire');

      expect(Pairs.attributes.content.validate.notNull.msg)
        .toBe('Le contenu est obligatoire');
    });

    test('should define pair_key field', () => {
      expect(Pairs.attributes.pair_key.allowNull).toBe(false);
    });

    test('should define id_page field', () => {
      expect(Pairs.attributes.id_page.allowNull).toBe(false);
    });
  });

  describe('beforeCreate hook', () => {
    test('should throw if Exercise model is missing', async () => {
      sequelize.models.Exercise = undefined;

      await expect(
        beforeCreateHook(
          { id_page: 1 },
          {}
        )
      ).rejects.toThrow('Modèle Exercise introuvable');
    });

    test('should throw if exercise not found', async () => {
      const ExerciseMock = {
        findByPk: jest.fn().mockResolvedValue(null),
      };

      await expect(
        beforeCreateHook(
          { id_page: 1 },
          {
            models: {
              Exercise: ExerciseMock,
            },
          }
        )
      ).rejects.toThrow('Exercise not found');

      expect(ExerciseMock.findByPk).toHaveBeenCalledWith(1);
    });

    test('should throw if exercise type is not PAIRS', async () => {
      const ExerciseMock = {
        findByPk: jest.fn().mockResolvedValue({
          type: 'UNIQUE',
        }),
      };

      await expect(
        beforeCreateHook(
          { id_page: 1 },
          {
            models: {
              Exercise: ExerciseMock,
            },
          }
        )
      ).rejects.toThrow(
        "Cet exercice n'est pas de type PAIRS"
      );
    });

    test('should allow creation if exercise type is PAIRS', async () => {
      const ExerciseMock = {
        findByPk: jest.fn().mockResolvedValue({
          type: 'PAIRS',
        }),
      };

      await expect(
        beforeCreateHook(
          { id_page: 1 },
          {
            models: {
              Exercise: ExerciseMock,
            },
          }
        )
      ).resolves.not.toThrow();

      expect(ExerciseMock.findByPk).toHaveBeenCalledWith(1);
    });
  });

  describe('beforeUpdate hook', () => {
    test('should throw if Exercise model is missing', async () => {
      sequelize.models.Exercise = undefined;

      await expect(
        beforeUpdateHook(
          { id_page: 1 },
          {}
        )
      ).rejects.toThrow('Modèle Exercise introuvable');
    });

    test('should validate exercise type on update', async () => {
      const ExerciseMock = {
        findByPk: jest.fn().mockResolvedValue({
          type: 'PAIRS',
        }),
      };

      await expect(
        beforeUpdateHook(
          { id_page: 1 },
          {
            models: {
              Exercise: ExerciseMock,
            },
          }
        )
      ).resolves.not.toThrow();
    });

    test('should reject update if exercise type invalid', async () => {
      const ExerciseMock = {
        findByPk: jest.fn().mockResolvedValue({
          type: 'EXERCISE',
        }),
      };

      await expect(
        beforeUpdateHook(
          { id_page: 1 },
          {
            models: {
              Exercise: ExerciseMock,
            },
          }
        )
      ).rejects.toThrow(
        "Cet exercice n'est pas de type PAIRS"
      );
    });
  });

  describe('associations', () => {
    test('should define belongsTo association with Exercise', () => {
      const models = {
        Exercise: {},
      };

      Pairs.associate(models);

      expect(Pairs.belongsTo).toHaveBeenCalledWith(
        models.Exercise,
        { foreignKey: 'id_page' }
      );
    });
  });
});