const controller = require("../../src/controllers/auth.controller");
const authService = require("../../src/services/auth.service");

// Mock du service
jest.mock("../../src/services/auth.service");

describe("Auth controller", () => {

    let req;
    let res;

    beforeEach(() => {
        req = {
        body: {}
    };

    res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });


    describe("login", () => {

        test("should return user and token", async () => {
            req.body = { email: "test@mail.com", password: "123" };
            authService.login.mockResolvedValue({ user: { id_user: 1 }, token: "jwt_token" });
            await controller.login(req, res);

            expect(authService.login).toHaveBeenCalledWith("test@mail.com", "123");
            expect(res.json).toHaveBeenCalledWith({ message: "Connexion réussie", data: { id_user: 1 }, token: "jwt_token" });
        });

        test("should handle service error (401)", async () => {
            req.body = { email: "test@mail.com", password: "wrong" };
            authService.login.mockRejectedValue({ message: "L'utilisateur n'existe pas", status: 401 });
            await controller.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "L'utilisateur n'existe pas" });
        });

        test("should handle generic error (500)", async () => {
            authService.login.mockRejectedValue(new Error("fail"));
            await controller.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "fail" });
        });

    });


    describe("register", () => {

        test("should create user and return token", async () => {
            req.body = { email: "test@mail.com", password: "123", username: "john" };
            authService.register.mockResolvedValue({ user: { id_user: 10 }, token: "jwt_token" });
            await controller.register(req, res);

            expect(authService.register).toHaveBeenCalledWith("test@mail.com", "123", "john");
            expect(res.json).toHaveBeenCalledWith({ message: "Utilisateur créé", data: { id_user: 10 }, token: "jwt_token" });
        });

        test("should handle validation error", async () => {
            authService.register.mockRejectedValue({ message: "Tous les champs sont obligatoires", status: 400 });
            await controller.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Tous les champs sont obligatoires" });
        });

        test("should handle server error", async () => {
            authService.register.mockRejectedValue(new Error("DB error"));
            await controller.register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "DB error" });
        });
    });
});