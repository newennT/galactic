// src/db/initDb.test.js

jest.mock("../../src/db/sequelize", () => ({
  sequelize: {
    sync: jest.fn().mockResolvedValue(),
  },
  connectWithRetry: jest.fn(),
}));

jest.mock("../../src/db/models", () => ({
  Level: { create: jest.fn() },
  Chapter: { create: jest.fn() },
  Page: { create: jest.fn() },
  Lesson: { create: jest.fn() },
  Exercise: { create: jest.fn() },
  UniqueResponse: { create: jest.fn() },
  Pairs: { create: jest.fn() },
  PutInOrder: { create: jest.fn() },
  User: { create: jest.fn() },
  UserChapter: { create: jest.fn() },
  UserExercise: { create: jest.fn() },
}));

// Mock des data-mocks
jest.mock("../../src/db/data-mock/chapters", () => [{ id_chapter: 1, title: "chapter" }]);
jest.mock("../../src/db/data-mock/levels", () => [{ id_level: 1, title: "level" }]);
jest.mock("../../src/db/data-mock/pages", () => [{ id_page: 1, title: "page", id_chapter: 1, order_index: 1, type: "lesson" }]);
jest.mock("../../src/db/data-mock/lessons", () => [{ id_page: 1, title: "lesson", content: "content" }]);
jest.mock("../../src/db/data-mock/exercises", () => [{ id_page: 1, title: "ex", question: "q", feedback: "f", type: "mcq" }]);
jest.mock("../../src/db/data-mock/uniqueResponses", () => [{ id_page: 1, content: "a", is_correct: true }]);
jest.mock("../../src/db/data-mock/pairs", () => [{ id_page: 1, content: "a", pair_key: "k" }]);
jest.mock("../../src/db/data-mock/putInOrder", () => [{ id_page: 1, content: "a", mixed_order: [], correct_order: [] }]);
jest.mock("../../src/db/data-mock/users", () => [{ id_user: 1, username: "u", email: "e", password: "p", is_admin: false }]);
jest.mock("../../src/db/data-mock/userChapters", () => [{ id_user: 1, id_chapter: 1, last_chapter_id: 1 }]);
jest.mock("../../src/db/data-mock/userExercises", () => [{ id_user: 1, id_page: 1, is_correct: true, is_done: true }]);

const initDb = require("../../src/db/initDb");
const models = require("../../src/db/models");
const { sequelize } = require("../../src/db/sequelize");

describe("initDb", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    Object.values(models).forEach((model) => {
      model.create.mockImplementation(async (data) => ({
        ...data,
        toJSON: () => data,
      }));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("devrait créer des levels", async () => {
    await initDb();
    expect(models.Level.create).toHaveBeenCalledWith({
      id_level: 1,
      title: "level",
    });
  });

  it("devrait créer des chapters", async () => {
    await initDb();
    expect(models.Chapter.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id_chapter: 1,
        title: "chapter",
        isPublished: true,
      })
    );
  });

  it("devrait créer des users", async () => {
    await initDb();
    expect(models.User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id_user: 1,
        username: "u",
        email: "e",
      })
    );
  });

  it("devrait appeler toutes les entités principales", async () => {
    await initDb();
    expect(models.Level.create).toHaveBeenCalled();
    expect(models.Chapter.create).toHaveBeenCalled();
    expect(models.Page.create).toHaveBeenCalled();
    expect(models.Lesson.create).toHaveBeenCalled();
    expect(models.Exercise.create).toHaveBeenCalled();
    expect(models.User.create).toHaveBeenCalled();
  });
});