const jwt = require("jsonwebtoken");

jest.mock("../../src/auth/private_key", () => "secret");

const auth = require("../../src/auth/auth");

describe("Auth middleware", () => {
    let req, res, next;
    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should return 401 if no Authorization header is present', () => {
        auth(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if invalid format', () => {
        req.headers.authorization = "Bearer invalid-token";
        auth(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next if token is valid', () => {
        const token = jwt.sign({ id_user: 1, is_admin: true }, "secret");
        req.headers.authorization = `Bearer ${token}`;
        auth(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(req.auth).toEqual({ id_user: 1, is_admin: true });
    });

    it('should return 401 if token is invalid', () => {
        req.headers.authorization = "Bearer invalid-token";
        auth(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if invalid format', () => {
        req.headers.authorization = "BadFormatToken";
        auth(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    })
    
});