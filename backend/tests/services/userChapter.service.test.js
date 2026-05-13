const service = require("../../src/services/userChapter.service");

const models = require("../../src/db/models");

jest.mock("../../src/db/models", () => ({
  User: { findByPk: jest.fn() },
  UserChapter: {
    findAll: jest.fn(),
    upsert: jest.fn(),
  },
  Page: { findAll: jest.fn() },
  Exercise: {},
  UserExercise: { findAll: jest.fn() },
  Chapter: {},
}));

describe("userChapter.service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------
  // getUser
  // -------------------------
  it("should get user by id", async () => {
    models.User.findByPk.mockResolvedValue({ id_user: 1 });

    const result = await service.getUser(1);

    expect(models.User.findByPk).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id_user: 1 });
  });

  // -------------------------
  // getUserChapters
  // -------------------------
  it("should get user chapters ordered desc", async () => {
    models.UserChapter.findAll.mockResolvedValue([{ id_chapter: 1 }]);

    const result = await service.getUserChapters(1);

    expect(models.UserChapter.findAll).toHaveBeenCalledWith({
      where: { id_user: 1 },
      include: [{ model: models.Chapter }],
      order: [["createdAt", "DESC"]],
    });

    expect(result).toEqual([{ id_chapter: 1 }]);
  });

  // -------------------------
  // getChapterExercises
  // -------------------------
  it("should return exercises from pages", async () => {
    models.Page.findAll.mockResolvedValue([
      {
        Exercise: { id_page: 1, question: "Q1" },
      },
      {
        Exercise: null,
      },
    ]);

    const result = await service.getChapterExercises(10);

    expect(models.Page.findAll).toHaveBeenCalledWith({
      where: {
        id_chapter: 10,
        type: "EXERCISE",
      },
      include: [
        {
          model: models.Exercise,
          attributes: ["id_page", "question"],
        },
      ],
    });

    expect(result).toEqual([{ id_page: 1, question: "Q1" }]);
  });

  // -------------------------
  // getUserResults
  // -------------------------
  it("should fetch user results", async () => {
    models.UserExercise.findAll.mockResolvedValue([
      { id_page: 1, is_correct: true },
    ]);

    const result = await service.getUserResults(1, [1, 2]);

    expect(models.UserExercise.findAll).toHaveBeenCalledWith({
      attributes: ["id_page", "is_correct"],
      where: {
        id_user: 1,
        id_page: [1, 2],
      },
      raw: true,
    });

    expect(result).toEqual([{ id_page: 1, is_correct: true }]);
  });

  // -------------------------
  // upsertUserChapter
  // -------------------------
  it("should upsert user chapter", async () => {
    models.UserChapter.upsert.mockResolvedValue([{ id_user: 1, id_chapter: 2 }]);

    const result = await service.upsertUserChapter(1, 2);

    expect(models.UserChapter.upsert).toHaveBeenCalledWith({
      id_user: 1,
      id_chapter: 2,
    });

    expect(result).toEqual([{ id_user: 1, id_chapter: 2 }]);
  });

  // -------------------------
  // buildExerciseView
  // -------------------------
  it("should build exercise view with status", () => {
    const pages = [
      { Exercise: { id_page: 1, question: "Q1" } },
      { Exercise: { id_page: 2, question: "Q2" } },
    ];

    const results = [{ id_page: 1, is_correct: true }];

    const result = service.buildExerciseView(pages, results);

    expect(result).toEqual([
      {
        id_page: 1,
        question: "Q1",
        is_correct: true,
        status: "correct",
      },
      {
        id_page: 2,
        question: "Q2",
        is_correct: null,
        status: "non fait",
      },
    ]);
  });

  // -------------------------
  // computeScore
  // -------------------------
  it("should compute score with percentage", () => {
    const pages = [{}, {}, {}];
    const results = [
      { is_correct: true },
      { is_correct: false },
      { is_correct: true },
    ];

    const result = service.computeScore(pages, results);

    expect(result).toEqual({
      total: 3,
      correct: 2,
      percentage: 67,
    });
  });

  it("should return null percentage if incomplete", () => {
    const pages = [{}, {}];
    const results = [{ is_correct: true }];

    const result = service.computeScore(pages, results);

    expect(result).toEqual({
      total: 2,
      correct: 1,
      percentage: null,
    });
  });

  // -------------------------
  // buildChapterResult
  // -------------------------
  it("should build chapter result object", () => {
  const chapter = { id_chapter: 1 };

  const pages = [
    {
      Exercise: {
        id_page: 10,
        question: "Question A",
      },
    },
  ];

  const results = [
    {
      id_page: 10,
      is_correct: true,
    },
  ];

  const result = service.buildChapterResult(chapter, pages, results);

  expect(result).toEqual({
    id_chapter: 1,
    total: 1,
    correct: 1,
    percentage: 100,
    exercises: [
      {
        id_page: 10,
        question: "Question A",
        is_correct: true,
        status: "correct",
      },
    ],
  });
});

it("should mark exercise as failed when is_correct is false", () => {
  const pages = [
    {
      Exercise: {
        id_page: 1,
        question: "Q1",
      },
    },
  ];

  const results = [
    {
      id_page: 1,
      is_correct: false,
    },
  ];

  const result = service.buildExerciseView(pages, results);

  expect(result).toEqual([
    {
      id_page: 1,
      question: "Q1",
      is_correct: false,
      status: "raté",
    },
  ]);
});
});