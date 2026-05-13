// tests/models/exercise.test.js

const defineExercise = require('../../src/models/exercise');

describe('Exercise model', () => {
  let sequelize;
  let Exercise;
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
          belongsToMany: jest.fn(),
          hasMany: jest.fn(),
        };

        return model;
      }),
    };

    const DataTypes = {
      INTEGER: 'INTEGER',
      TEXT: 'TEXT',
      STRING: 'STRING',
      ENUM: (...values) => ({
        type: 'ENUM',
        values,
      }),
    };

    Exercise = defineExercise(sequelize, DataTypes);
  });

  describe('mediaConsistency validation', () => {
    test('should throw if media_url exists without media_type', () => {
      const validation =
        Exercise.options.validate.mediaConsistency;

      const fakeExercise = {
        media_url: 'audio.mp3',
        media_type: null,
      };

      expect(() => {
        validation.call(fakeExercise);
      }).toThrow(
        'media_url et media_type doivent être définis ensemble'
      );
    });

    test('should throw if AUDIO url is not mp3', () => {
      const validation =
        Exercise.options.validate.mediaConsistency;

      const fakeExercise = {
        media_url: 'audio.wav',
        media_type: 'AUDIO',
      };

      expect(() => {
        validation.call(fakeExercise);
      }).toThrow(
        "L'URL audio doit pointer vers un fichier .mp3 direct"
      );
    });

    test('should pass with valid mp3 url', () => {
      const validation =
        Exercise.options.validate.mediaConsistency;

      const fakeExercise = {
        media_url: 'audio.mp3',
        media_type: 'AUDIO',
      };

      expect(() => {
        validation.call(fakeExercise);
      }).not.toThrow();
    });

    test('should fail if media_url exists without media_type', () => {
      const validation = Exercise.options.validate.mediaConsistency;

      const fakeExercise = {
        media_url: 'audio.mp3',
        media_type: null,
      };

      expect(() => {
        validation.call(fakeExercise);
      }).toThrow(
        'media_url et media_type doivent être définis ensemble'
      );
    });
  });

  test('should fail if media_type exists without media_url', () => {
    const validation = Exercise.options.validate.mediaConsistency;

    const fakeExercise = {
      media_url: null,
      media_type: 'AUDIO',
    };

    expect(() => {
      validation.call(fakeExercise);
    }).toThrow(
      'media_url et media_type doivent être définis ensemble'
    );
  });

  

  describe('beforeCreate hook', () => {
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

    test('should throw if page type is invalid', async () => {
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
        "Cette page n'est pas de type EXERCISE"
      );
    });

    test('should pass if page type is EXERCISE', async () => {
      const PageMock = {
        findByPk: jest.fn().mockResolvedValue({
          type: 'EXERCISE',
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

    test('should use sequelize.models.Page fallback', async () => {
      const PageMock = {
        findByPk: jest.fn().mockResolvedValue({
          type: 'EXERCISE',
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

    test('should throw if Page model is missing', async () => {
      sequelize.models.Page = undefined;

      await expect(
        beforeCreateHook(
          { id_page: 1 },
          {}
        )
      ).rejects.toThrow('Modèle Page introuvable');
    });
  });
});