// tests/models/uniqueResponse.test.js

const defineUniqueResponse = require('../../src/models/uniqueResponse');

describe('UniqueResponse model', () => {
  let sequelize;
  let UniqueResponse;
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
      BOOLEAN: 'BOOLEAN',
    };

    UniqueResponse = defineUniqueResponse(sequelize, DataTypes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('model definition', () => {
    test('should define id_response as primary key', () => {
      expect(UniqueResponse.attributes.id_response).toEqual({
        type: 'INTEGER',
        primaryKey: true,
        autoIncrement: true,
      });
    });

    test('should define content field', () => {
      expect(UniqueResponse.attributes.content.allowNull).toBe(false);

      expect(UniqueResponse.attributes.content.validate.notEmpty.msg)
        .toBe('Le contenu est obligatoire');

      expect(UniqueResponse.attributes.content.validate.notNull.msg)
        .toBe('Le contenu est obligatoire');
    });

    test('should define is_correct default value', () => {
      expect(UniqueResponse.attributes.is_correct.allowNull).toBe(false);
      expect(UniqueResponse.attributes.is_correct.defaultValue).toBe(false);
    });

    test('should define id_page field', () => {
      expect(UniqueResponse.attributes.id_page.allowNull).toBe(false);
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
    });

    test('should throw if exercise type is not UNIQUE', async () => {
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
      ).rejects.toThrow(
        "Cet exercice n'est pas de type UNIQUE"
      );
    });

    test('should allow valid UNIQUE response creation', async () => {
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

    test('should allow update for valid UNIQUE type', async () => {
      const ExerciseMock = {
        findByPk: jest.fn().mockResolvedValue({
          type: 'UNIQUE',
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

    test('should reject update for invalid type', async () => {
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
        "Cet exercice n'est pas de type UNIQUE"
      );
    });
  });

  describe('associations', () => {
    test('should define belongsTo Exercise association', () => {
      const models = {
        Exercise: {},
      };

      UniqueResponse.associate(models);

      expect(UniqueResponse.belongsTo).toHaveBeenCalledWith(
        models.Exercise,
        { foreignKey: 'id_page' }
      );
    });
  });
});