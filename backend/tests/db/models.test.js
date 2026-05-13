it("should call associate on models that define it", () => {
  jest.resetModules();

  const associateMock = jest.fn();

  jest.doMock("../../src/db/sequelize", () => ({
    sequelize: {},
  }));

  jest.doMock("sequelize", () => ({
    DataTypes: {},
  }));

  jest.doMock("../../src/models/chapter", () =>
    (sequelize, DataTypes) => ({
      associate: associateMock,
    })
  );

  const emptyModel = () => (sequelize, DataTypes) => ({});
  jest.doMock("../../src/models/level", emptyModel);
  jest.doMock("../../src/models/page", emptyModel);
  jest.doMock("../../src/models/lesson", emptyModel);
  jest.doMock("../../src/models/exercise", emptyModel);
  jest.doMock("../../src/models/uniqueResponse", emptyModel);
  jest.doMock("../../src/models/pairs", emptyModel);
  jest.doMock("../../src/models/putInOrder", emptyModel);
  jest.doMock("../../src/models/user", emptyModel);
  jest.doMock("../../src/models/userChapter", emptyModel);
  jest.doMock("../../src/models/userExercise", emptyModel);

  require("../../src/db/models");

  expect(associateMock).toHaveBeenCalled();
});