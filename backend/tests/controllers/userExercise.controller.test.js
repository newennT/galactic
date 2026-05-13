const controller = require("../../src/controllers/userExercise.controller");
const service = require("../../src/services/userExercise.service");

jest.mock("../../src/services/userExercise.service", () => ({
  getUserExercisesByChapter: jest.fn(),
  getChapterScore: jest.fn(),
  upsertUserExercise: jest.fn(),
}));

function mockReqRes() {
  const req = {
    auth: { id_user: 1 },
    params: { id: 10 },
    body: {},
  };

  const res = {
    json: jest.fn(),
    status: jest.fn(() => res),
  };

  return { req, res };
}

describe("userExercise.controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // -------------------
  // getByChapter
  // -------------------
  it("should return exercises by chapter", async () => {
    const { req, res } = mockReqRes();

    service.getUserExercisesByChapter.mockResolvedValue([
      { id_page: 1 },
    ]);

    await controller.getByChapter(req, res);

    expect(service.getUserExercisesByChapter).toHaveBeenCalledWith(1, 10);
    expect(res.json).toHaveBeenCalledWith([{ id_page: 1 }]);
  });

  it("should handle error in getByChapter", async () => {
    const { req, res } = mockReqRes();

    service.getUserExercisesByChapter.mockRejectedValue(new Error("fail"));

    await controller.getByChapter(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "fail",
    });
  });

  // -------------------
  // getScore
  // -------------------
  it("should return score", async () => {
    const { req, res } = mockReqRes();

    service.getChapterScore.mockResolvedValue({
      total: 10,
      correct: 7,
      percentage: 70,
    });

    await controller.getScore(req, res);

    expect(service.getChapterScore).toHaveBeenCalledWith(1, 10);
    expect(res.json).toHaveBeenCalledWith({
      total: 10,
      correct: 7,
      percentage: 70,
    });
  });

  it("should handle error in getScore", async () => {
    const { req, res } = mockReqRes();

    service.getChapterScore.mockRejectedValue(new Error("score error"));

    await controller.getScore(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "score error",
    });
  });

  // -------------------
  // upsert
  // -------------------
  it("should upsert user exercise", async () => {
    const { req, res } = mockReqRes();

    req.body = {
      id_page: 5,
      is_correct: true,
    };

    service.upsertUserExercise.mockResolvedValue({ success: true });

    await controller.upsert(req, res);

    expect(service.upsertUserExercise).toHaveBeenCalledWith(
      1,
      5,
      true
    );

    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it("should handle 400 error with custom status", async () => {
    const { req, res } = mockReqRes();

    const error = new Error("bad request");
    error.status = 400;

    service.upsertUserExercise.mockRejectedValue(error);

    await controller.upsert(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "bad request",
    });
  });

  it("should handle generic error in upsert", async () => {
    const { req, res } = mockReqRes();

    service.upsertUserExercise.mockRejectedValue(
      new Error("server crash")
    );

    await controller.upsert(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "server crash",
    });
  });
});