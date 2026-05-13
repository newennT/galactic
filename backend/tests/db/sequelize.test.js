// tests/db/sequelize.test.js

describe("connectWithRetry", () => {
  const mockAuthenticate = jest.fn();

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    jest.doMock("sequelize", () => ({
      Sequelize: jest.fn(() => ({
        authenticate: mockAuthenticate,
      })),
    }));

    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("should connect", async () => {
    mockAuthenticate.mockResolvedValueOnce();

    const { connectWithRetry } = require("../../src/db/sequelize");

    await connectWithRetry();

    expect(mockAuthenticate).toHaveBeenCalledTimes(1);

    expect(console.log).toHaveBeenCalledWith(
      "Connection has been established successfully."
    );

    expect(console.error).not.toHaveBeenCalled();
  });

  it("should retry then succeed", async () => {
    jest.useFakeTimers();

    mockAuthenticate
      .mockRejectedValueOnce(new Error("DB down"))
      .mockResolvedValueOnce();

    const { connectWithRetry } = require("../../src/db/sequelize");

    const promise = connectWithRetry({ retryDelay: 2000 });

    await Promise.resolve();

    expect(console.error).toHaveBeenCalledWith(
      "Database not ready, retrying in 5s...",
      "DB down"
    );

    expect(mockAuthenticate).toHaveBeenCalledTimes(1);

    await jest.runOnlyPendingTimersAsync();

    await promise;

    expect(mockAuthenticate).toHaveBeenCalledTimes(2);

    expect(console.log).toHaveBeenCalledWith(
      "Connection has been established successfully."
    );
  });

  it("should retry multiple times until success", async () => {
    jest.useFakeTimers();

    mockAuthenticate
      .mockRejectedValueOnce(new Error("fail 1"))
      .mockRejectedValueOnce(new Error("fail 2"))
      .mockResolvedValueOnce();

    const { connectWithRetry } = require("../../src/db/sequelize");

    const promise = connectWithRetry({ retryDelay: 1000 });

    await jest.runOnlyPendingTimersAsync();
    await jest.runOnlyPendingTimersAsync();

    await promise;

    expect(mockAuthenticate).toHaveBeenCalledTimes(3);

    expect(console.error).toHaveBeenCalledTimes(2);

    expect(console.log).toHaveBeenCalledWith(
      "Connection has been established successfully."
    );
  });
});

describe("sequelize configuration", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    });

    afterAll(() => {
    process.env = OLD_ENV;
    });

  it("should use DB_PORT from env", () => {
    process.env.DB_PORT = "1234";

    const mockSequelize = jest.fn(() => ({
      authenticate: jest.fn(),
    }));

    jest.doMock("sequelize", () => ({
      Sequelize: mockSequelize,
    }));

    jest.isolateModules(() => {
      require("../../src/db/sequelize");
    });

    expect(mockSequelize).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        port: "1234",
      })
    );
  });

  it("should fallback to port 3306", () => {
    delete process.env.DB_PORT;

    jest.doMock("dotenv", () => ({
        config: jest.fn(),
    }));

    const mockSequelize = jest.fn(() => ({
      authenticate: jest.fn(),
    }));

    jest.doMock("sequelize", () => ({
      Sequelize: mockSequelize,
    }));

    jest.isolateModules(() => {
      require("../../src/db/sequelize");
    });

    expect(mockSequelize).toHaveBeenCalled();
    expect(mockSequelize.mock.calls[0][3].port).toBe(3306);
  });
});