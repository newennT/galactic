// tests/models/user.test.js

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const bcrypt = require('bcrypt');
const defineUser = require('../../src/models/user');

describe('User model', () => {
  let sequelize;
  let User;
  let beforeCreateHook;
  let beforeUpdateHook;

  beforeEach(() => {
    beforeCreateHook = null;
    beforeUpdateHook = null;

    sequelize = {
      define: jest.fn((modelName, attributes, options) => {
        const model = function () {};

        model.name = modelName;
        model.attributes = attributes;
        model.options = options;

        model.belongsToMany = jest.fn();

        model.prototype = {};

        beforeCreateHook = options.hooks.beforeCreate;
        beforeUpdateHook = options.hooks.beforeUpdate;

        return model;
      }),
    };

    const DataTypes = {
      INTEGER: 'INTEGER',
      BOOLEAN: 'BOOLEAN',
      DATE: 'DATE',
      NOW: 'NOW',

      STRING: (size) => ({
        type: 'STRING',
        size,
      }),
    };

    User = defineUser(sequelize, DataTypes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('model definition', () => {
    test('should define User model', () => {
      expect(sequelize.define).toHaveBeenCalledWith(
        'User',
        expect.any(Object),
        expect.any(Object)
      );
    });

    test('should define id_user as primary key', () => {
      expect(User.attributes.id_user).toEqual({
        type: 'INTEGER',
        primaryKey: true,
        autoIncrement: true,
      });
    });

    test('should define username field', () => {
      expect(User.attributes.username.allowNull)
        .toBe(false);

      expect(User.attributes.username.validate.len.args)
        .toEqual([3, 50]);

      expect(User.attributes.username.validate.len.msg)
        .toBe(
          'Le pseudo doit avoir entre 3 et 50 caractères'
        );
    });

    test('should define email field', () => {
      expect(User.attributes.email.allowNull)
        .toBe(false);

      expect(User.attributes.email.validate.isEmail.msg)
        .toBe("L'email doit être valide");
    });

    test('should define password field', () => {
      expect(User.attributes.password.allowNull)
        .toBe(false);
    });

    test('should define is_admin default value', () => {
      expect(User.attributes.is_admin.defaultValue)
        .toBe(false);
    });

    test('should define timestamps', () => {
      expect(User.options.timestamps)
        .toBe(true);
    });

    test('should exclude password from default scope', () => {
      expect(
        User.options.defaultScope.attributes.exclude
      ).toContain('password');
    });
  });

  describe('beforeCreate hook', () => {
    test('should hash password before create', async () => {
      bcrypt.hash.mockResolvedValue('hashed-password');

      const user = {
        password: 'plain-password',
      };

      await beforeCreateHook(user);

      expect(bcrypt.hash).toHaveBeenCalledWith(
        'plain-password',
        10
      );

      expect(user.password)
        .toBe('hashed-password');
    });
  });

  describe('beforeUpdate hook', () => {
    test('should hash password if password changed', async () => {
      bcrypt.hash.mockResolvedValue('new-hash');

      const user = {
        password: 'new-password',

        changed: jest.fn((field) => {
          return field === 'password';
        }),
      };

      await beforeUpdateHook(user);

      expect(user.changed)
        .toHaveBeenCalledWith('password');

      expect(bcrypt.hash)
        .toHaveBeenCalledWith('new-password', 10);

      expect(user.password)
        .toBe('new-hash');
    });

    test('should not hash password if password not changed', async () => {
      const user = {
        password: 'password',

        changed: jest.fn(() => false),
      };

      await beforeUpdateHook(user);

      expect(user.changed)
        .toHaveBeenCalledWith('password');

      expect(bcrypt.hash)
        .not.toHaveBeenCalled();
    });
  });

  describe('comparePassword method', () => {
    test('should compare password with bcrypt.compare', async () => {
      bcrypt.compare.mockResolvedValue(true);

      const user = {
        password: 'hashed-password',
      };

      const result =
        await User.prototype.comparePassword.call(
          user,
          'plain-password'
        );

      expect(bcrypt.compare)
        .toHaveBeenCalledWith(
          'plain-password',
          'hashed-password'
        );

      expect(result).toBe(true);
    });
  });

  describe('associations', () => {
    test('should define belongsToMany association with Chapter', () => {
      const models = {
        Chapter: {},
        Exercise: {},
        UserChapter: {},
        UserExercise: {},
      };

      User.associate(models);

      expect(User.belongsToMany)
        .toHaveBeenCalledWith(
          models.Chapter,
          {
            through: models.UserChapter,
            foreignKey: 'id_user',
          }
        );
    });

    test('should define belongsToMany association with Exercise', () => {
      const models = {
        Chapter: {},
        Exercise: {},
        UserChapter: {},
        UserExercise: {},
      };

      User.associate(models);

      expect(User.belongsToMany)
        .toHaveBeenCalledWith(
          models.Exercise,
          {
            through: models.UserExercise,
            foreignKey: 'id_user',
          }
        );
    });
  });
});