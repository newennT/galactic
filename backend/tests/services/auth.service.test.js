const authService = require("../../src/services/auth.service");
const models = require("../../src/db/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../../src/db/models", () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn()
    }
}));

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth service", () => {

  afterEach(() => {
        jest.clearAllMocks();
  });

  describe("login", () => {

    test("should throw if user not found", async () => {
        models.User.findOne.mockResolvedValue(null);

      await expect(authService.login("test@mail.com", "pass")).rejects.toMatchObject({
            message: "L'utilisateur n'existe pas",
            status: 401
      });
    });

    test("should throw if password invalid", async () => {
        models.User.findOne.mockResolvedValue({ password: "hashed", });
        bcrypt.compare.mockResolvedValue(false);

        await expect(authService.login("test@mail.com", "wrong")
        ).rejects.toMatchObject({ message: "Le mot de passe est incorrect", status: 401 });
    });

    test("should login and return token", async () => {
        const fakeUser = { id_user: 1, is_admin: false, password: "hashed", update: jest.fn() };

        models.User.findOne.mockResolvedValue(fakeUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("fake_token");

        const result = await authService.login("test@mail.com", "pass");

        expect(fakeUser.update).toHaveBeenCalledWith({ last_login: expect.any(Date) });

        expect(jwt.sign).toHaveBeenCalledWith(
            { id_user: 1, is_admin: false },
            expect.anything(),
            { expiresIn: "24h" }
      );

        expect(result).toEqual({ user: fakeUser, token: "fake_token" });
    });

  });


  describe("register", () => {

    test("should throw if missing fields", async () => {
        await expect(authService.register(null, "pass", "user")).rejects.toMatchObject({ message: "Tous les champs sont obligatoires", status: 400 });
    });

    test("should throw if email already exists", async () => { 
        models.User.findOne.mockResolvedValue({ id: 1 });
        await expect(authService.register("test@mail.com", "pass", "user")).rejects.toMatchObject({ message: "L'email est déjà utilisé", status: 400 }); });

    test("should create user and return token", async () => {
        models.User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue("hashed_password");
        const fakeUser = { id_user: 10 };
        models.User.create.mockResolvedValue(fakeUser);
        jwt.sign.mockReturnValue("token_123");
        const result = await authService.register("test@mail.com", "pass", "user");

        expect(bcrypt.hash).toHaveBeenCalledWith("pass", 10);
        expect(models.User.create).toHaveBeenCalledWith({ email: "test@mail.com", password: "hashed_password", username: "user" });
        expect(result).toEqual({ user: fakeUser, token: "token_123" });
    });

  });

});