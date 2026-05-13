// tests/models/page.test.js

const definePage = require('../../src/models/page');

describe('Page model', () => {
  let sequelize;
  let Page;

  beforeEach(() => {
    sequelize = {
      define: jest.fn((modelName, attributes, options) => {
        return {
          name: modelName,
          attributes,
          options,

          hasOne: jest.fn(),
          belongsTo: jest.fn(),
        };
      }),
    };

    const DataTypes = {
      INTEGER: 'INTEGER',

      ENUM: (...values) => ({
        type: 'ENUM',
        values,
      }),
    };

    Page = definePage(sequelize, DataTypes);
  });

  describe('model definition', () => {
    test('should define Page model', () => {
      expect(sequelize.define).toHaveBeenCalledWith(
        'Page',
        expect.any(Object),
        expect.any(Object)
      );
    });

    test('should define id_page as primary key', () => {
      expect(Page.attributes.id_page).toEqual({
        type: 'INTEGER',
        primaryKey: true,
        autoIncrement: true,
      });
    });

    test('should require order_index', () => {
      expect(Page.attributes.order_index.allowNull)
        .toBe(false);
    });

    test('should require id_chapter', () => {
      expect(Page.attributes.id_chapter.allowNull)
        .toBe(false);
    });

    test('should define valid page types', () => {
      expect(Page.attributes.type.type).toEqual({
        type: 'ENUM',
        values: ['LESSON', 'EXERCISE'],
    });

      expect(Page.attributes.type.allowNull)
        .toBe(false);
    });

    test('should enable timestamps', () => {
      expect(Page.options.timestamps)
        .toBe(true);
    });
  });

  describe('validType validation', () => {
    let validType;

    beforeEach(() => {
      validType =
        Page.options.validate.validType;
    });

    test('should accept LESSON type', () => {
      const fakePage = {
        type: 'LESSON',
      };

      expect(() => {
        validType.call(fakePage);
      }).not.toThrow();
    });

    test('should accept EXERCISE type', () => {
      const fakePage = {
        type: 'EXERCISE',
      };

      expect(() => {
        validType.call(fakePage);
      }).not.toThrow();
    });

    test('should reject invalid type', () => {
      const fakePage = {
        type: 'ARTICLE',
      };

      expect(() => {
        validType.call(fakePage);
      }).toThrow(
        "Le type de page doit être 'LESSON' ou 'EXERCISE'"
      );
    });

    test('should reject null type', () => {
      const fakePage = {
        type: null,
      };

      expect(() => {
        validType.call(fakePage);
      }).toThrow(
        "Le type de page doit être 'LESSON' ou 'EXERCISE'"
      );
    });

    test('should reject undefined type', () => {
      const fakePage = {};

      expect(() => {
        validType.call(fakePage);
      }).toThrow(
        "Le type de page doit être 'LESSON' ou 'EXERCISE'"
      );
    });
  });

  describe('associations', () => {
    test('should define hasOne association with Lesson', () => {
      const models = {
        Lesson: {},
        Exercise: {},
        Chapter: {},
      };

      Page.associate(models);

      expect(Page.hasOne).toHaveBeenCalledWith(
        models.Lesson,
        {
          foreignKey: 'id_page',
          onDelete: 'CASCADE',
        }
      );
    });

    test('should define hasOne association with Exercise', () => {
      const models = {
        Lesson: {},
        Exercise: {},
        Chapter: {},
      };

      Page.associate(models);

      expect(Page.hasOne).toHaveBeenCalledWith(
        models.Exercise,
        {
          foreignKey: 'id_page',
          onDelete: 'CASCADE',
        }
      );
    });

    test('should define belongsTo association with Chapter', () => {
      const models = {
        Lesson: {},
        Exercise: {},
        Chapter: {},
      };

      Page.associate(models);

      expect(Page.belongsTo).toHaveBeenCalledWith(
        models.Chapter,
        {
          foreignKey: 'id_chapter',
        }
      );
    });
  });
});