const controller = require("../../src/controllers/userChapter.controller");
const service = require("../../src/services/userChapter.service");

jest.mock("../../src/services/userChapter.service");

describe("userChapter.controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      auth: { id_user: 1 },
      body: {},
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });


  it("should return 404 if user not found", async () => {
    service.getUser.mockResolvedValue(null);

    await controller.getUserChapters(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Utilisateur non trouvé",
    });
  });

  it("should return chapters with score when pages exist", async () => {
    service.getUser.mockResolvedValue({ id_user: 1 });

    service.getUserChapters.mockResolvedValue([
      {
        id_chapter: 10,
        Chapter: { id_chapter: 10, title: "Chap 1" },
      },
    ]);

    service.getChapterExercises.mockResolvedValue([
      { id_page: 100 },
      { id_page: 101 },
    ]);

    service.getUserResults.mockResolvedValue([
      { id_page: 100, is_correct: true },
      { id_page: 101, is_correct: false },
    ]);

    service.buildChapterResult.mockReturnValue({
      id_chapter: 10,
      total: 2,
      correct: 1,
      percentage: 50,
      exercises: [],
    });

    await controller.getUserChapters(req, res);

    expect(service.getUser).toHaveBeenCalledWith(1);
    expect(service.getUserChapters).toHaveBeenCalledWith(1);

    expect(service.getChapterExercises).toHaveBeenCalledWith(10);
    expect(service.getUserResults).toHaveBeenCalledWith(1, [100, 101]);

    expect(service.buildChapterResult).toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith({
      user: { id_user: 1 },
      chapters: [
        {
          id_chapter: 10,
          total: 2,
          correct: 1,
          percentage: 50,
          exercises: [],
        },
      ],
    });
  });

  it("should return chapter with empty stats if no pages", async () => {
    service.getUser.mockResolvedValue({ id_user: 1 });

    service.getUserChapters.mockResolvedValue([
      {
        id_chapter: 10,
        Chapter: { id_chapter: 10 },
      },
    ]);

    service.getChapterExercises.mockResolvedValue([]); // <- important

    await controller.getUserChapters(req, res);

    expect(res.json).toHaveBeenCalledWith({
      user: { id_user: 1 },
      chapters: [
        {
          id_chapter: 10,
          total: 0,
          correct: 0,
          percentage: null,
        },
      ],
    });
  });


  it("should return 400 if id_chapter missing", async () => {
    req.body = {};

    await controller.upsertUserChapter(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "id_chapter requis",
    });
  });

  it("should upsert and return ids", async () => {
    req.body = { id_chapter: 2 };

    service.upsertUserChapter.mockResolvedValue();

    await controller.upsertUserChapter(req, res);

    expect(service.upsertUserChapter).toHaveBeenCalledWith(1, 2);

    expect(res.json).toHaveBeenCalledWith({
      id_user: 1,
      id_chapter: 2,
    });
  });

});