const service = require("../../src/services/userExercise.service");
const models = require("../../src/db/models");

jest.mock("../../src/db/models", () => ({
  UserExercise: {
    findAll: jest.fn(),
    upsert: jest.fn(),
  },
  Exercise: {},
  Page: {
    findAll: jest.fn(),
  },
}));

describe("userExercise.service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch user exercises by chapter", async () => {
    models.UserExercise.findAll.mockResolvedValue([{ id: 1 }]);

    const result = await service.getUserExercisesByChapter(1, 10);

    expect(models.UserExercise.findAll).toHaveBeenCalledWith({
      include: [
        {
          model: models.Exercise,
          where: { id_chapter: 10 },
        },
      ],
      where: { id_user: 1 },
    });

    expect(result).toEqual([{ id: 1 }]);
  });


  it("should return zero score when no pages", async () => {
    models.Page.findAll.mockResolvedValue([]);

    const result = await service.getChapterScore(1, 10);

    expect(models.Page.findAll).toHaveBeenCalledWith({
      attributes: ["id_page"],
      where: { id_chapter: 10 },
      raw: true,
    });

    expect(result).toEqual({
      total: 0,
      correct: 0,
      percentage: 0,
    });
  });

  it("should compute chapter score from pages and results", async () => {
    models.Page.findAll.mockResolvedValue([
      { id_page: 1 },
      { id_page: 2 },
    ]);

    models.UserExercise.findAll.mockResolvedValue([
      { is_correct: true },
      { is_correct: false },
      { is_correct: true },
    ]);

    const result = await service.getChapterScore(1, 10);

    expect(models.UserExercise.findAll).toHaveBeenCalledWith({
      attributes: ["is_correct"],
      where: {
        id_user: 1,
        id_page: [1, 2],
      },
      raw: true,
    });

    expect(result).toEqual({
      total: 3,
      correct: 2,
      percentage: 67,
    });
  });


  it("should throw error if id_page missing", async () => {
    await expect(
      service.upsertUserExercise(1, null, true)
    ).rejects.toMatchObject({
      message: "id_page requis",
      status: 400,
    });
  });

  it("should upsert user exercise", async () => {
    models.UserExercise.upsert.mockResolvedValue();

    const result = await service.upsertUserExercise(1, 10, true);

    expect(models.UserExercise.upsert).toHaveBeenCalledWith({
      id_user: 1,
      id_page: 10,
      is_done: true,
      is_correct: true,
    });

    expect(result).toEqual({ success: true });
  });

    it("should compute score correctly (via getChapterScore)", async () => {
        models.Page.findAll.mockResolvedValue([
            { id_page: 1 },
            { id_page: 2 },
            { id_page: 3 },
        ]);

        models.UserExercise.findAll.mockResolvedValue([
            { is_correct: true },
            { is_correct: false },
            { is_correct: true },
        ]);

        const result = await service.getChapterScore(1, 10);

        expect(result).toEqual({
            total: 3,
            correct: 2,
            percentage: 67,
        });
    });

    it("should compute score correctly", () => {
        const results = [
            { is_correct: true },
            { is_correct: false },
            { is_correct: true },
        ];

        const result = service.computeScore(results);

        expect(result).toEqual({
            total: 3,
            correct: 2,
            percentage: 67,
        });
    });

    it("should handle empty results (covers ternary branch)", () => {
        const result = service.computeScore([]);

        expect(result).toEqual({
            total: 0,
            correct: 0,
            percentage: 0,
        });
    });

    it("should compute percentage when all correct", () => {
        const results = [
            { is_correct: true },
            { is_correct: true },
            { is_correct: true },
            { is_correct: true },
        ];
        const result = service.computeScore(results);

        expect(result.percentage).toBe(100);
    });

    it("should return zero when no results via compute flow", async () => {
        models.Page.findAll.mockResolvedValue([]);

        const result = await service.getChapterScore(1, 10);

        expect(result).toEqual({
            total: 0,
            correct: 0,
            percentage: 0,
        });
    });

    it("should compute percentage when results exist", async () => {
        models.Page.findAll.mockResolvedValue([
            { id_page: 1 },
            { id_page: 2 },
            { id_page: 3 },
            { id_page: 4 },
        ]);

        models.UserExercise.findAll.mockResolvedValue([
            { is_correct: true },
            { is_correct: true },
            { is_correct: false },
            { is_correct: true },
        ]);

        const result = await service.getChapterScore(1, 10);

        expect(result).toEqual({
            total: 4,
            correct: 3,
            percentage: 75,
        });
    });

    
    it("should round percentage correctly", () => {
        const results = [
            { is_correct: true },
            { is_correct: true },
            { is_correct: false },
        ]; 

        const result = service.computeScore(results);

        expect(result.percentage).toBe(67);
    });
      it("should throw if id_page missing", async () => {
    await expect(
      service.upsertUserExercise(1, null, true)
    ).rejects.toThrow("id_page requis");
  });

  it("should upsert user exercise", async () => {
    models.UserExercise.upsert.mockResolvedValue();

    const result = await service.upsertUserExercise(1, 10, true);

    expect(models.UserExercise.upsert).toHaveBeenCalledWith({
      id_user: 1,
      id_page: 10,
      is_done: true,
      is_correct: true,
    });

    expect(result).toEqual({ success: true });
  });
});