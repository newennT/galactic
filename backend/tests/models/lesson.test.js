// tests/models/lesson.test.js

const defineLesson = require('../../src/models/lesson');

describe('Lesson model', () => {
  let sequelize;
  let Lesson;
  let beforeCreateHook;

  beforeEach(() => {
    beforeCreateHook = null;

    sequelize = {
      models: {},

      define: jest.fn((modelName, attributes, options) => {
        const model = {
          name: modelName,
          attributes,
          options,

          beforeCreate: jest.fn((hook) => {
            beforeCreateHook = hook;
          }),

          belongsTo: jest.fn(),
        };

        return model;
      }),
    };

    const DataTypes = {
      INTEGER: 'INTEGER',
      TEXT: 'TEXT',
    };

    Lesson = defineLesson(sequelize, DataTypes);
  });

  describe('title validation', () => {
    test('should require title field', () => {
      expect(
        Lesson.attributes.title.allowNull
      ).toBe(false);

      expect(
        Lesson.attributes.title.validate.notEmpty.msg
      ).toBe('Le titre est obligatoire');

      expect(
        Lesson.attributes.title.validate.notNull.msg
      ).toBe('Le titre est obligatoire');
    });
  });

  describe('content validation', () => {
    test('should require content field', () => {
      expect(
        Lesson.attributes.content.allowNull
      ).toBe(false);

      expect(
        Lesson.attributes.content.validate.notEmpty.msg
      ).toBe('Le contenu est obligatoire');

      expect(
        Lesson.attributes.content.validate.notNull.msg
      ).toBe('Le contenu est obligatoire');
    });
  });

  describe('beforeCreate hook', () => {
    test('should throw if Page model is missing', async () => {
      sequelize.models.Page = undefined;

      await expect(
        beforeCreateHook(
          { id_page: 1 },
          {}
        )
      ).rejects.toThrow('Modèle Page introuvable');
    });

    test('should use injected Page model', async () => {
      const PageMock = {
        findByPk: jest.fn().mockResolvedValue({
          type: 'LESSON',
        }),
      };

      await expect(
        beforeCreateHook(
          { id_page: 1 },
          {
            models: {
              Page: PageMock,
            },
          }
        )
      ).resolves.not.toThrow();

      expect(PageMock.findByPk).toHaveBeenCalledWith(1);
    });

    test('should fallback to sequelize.models.Page', async () => {
      const PageMock = {
        findByPk: jest.fn().mockResolvedValue({
          type: 'LESSON',
        }),
      };

      sequelize.models.Page = PageMock;

      await expect(
        beforeCreateHook(
          { id_page: 1 },
          {}
        )
      ).resolves.not.toThrow();

      expect(PageMock.findByPk).toHaveBeenCalledWith(1);
    });

    test('should throw if page does not exist', async () => {
      const PageMock = {
        findByPk: jest.fn().mockResolvedValue(null),
      };

      await expect(
        beforeCreateHook(
          { id_page: 1 },
          {
            models: {
              Page: PageMock,
            },
          }
        )
      ).rejects.toThrow('Page non trouvée');
    });

    test('should throw if page type is not LESSON', async () => {
      const PageMock = {
        findByPk: jest.fn().mockResolvedValue({
          type: 'ARTICLE',
        }),
      };

      await expect(
        beforeCreateHook(
          { id_page: 1 },
          {
            models: {
              Page: PageMock,
            },
          }
        )
      ).rejects.toThrow(
        "Cette page n'est pas de type LESSON"
      );
    });

    test('should validate LESSON page type', async () => {
      const PageMock = {
        findByPk: jest.fn().mockResolvedValue({
          type: 'LESSON',
        }),
      };

      await expect(
        beforeCreateHook(
          { id_page: 1 },
          {
            models: {
              Page: PageMock,
            },
          }
        )
      ).resolves.not.toThrow();
    });
  });

  describe('associations', () => {
    test('should define belongsTo association with Page', () => {
      const models = {
        Page: {},
      };

      Lesson.associate(models);

      expect(Lesson.belongsTo).toHaveBeenCalledWith(
        models.Page,
        { foreignKey: 'id_page' }
      );
    });
  });
});