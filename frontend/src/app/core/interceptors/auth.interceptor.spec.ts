import { HttpHandler, HttpRequest } from "@angular/common/http";
import { AuthInterceptor } from "./auth.interceptor";

describe('AuthInterceptor', () => {
    let interceptor: AuthInterceptor;
    let authServiceMock: {
        getToken: jest.Mock
    };
    let nextMock: HttpHandler & { handle: jest.Mock };

    beforeEach(() => {
        authServiceMock = {
            getToken: jest.fn()
        };

        nextMock = {
            handle: jest.fn().mockReturnValue({}),
        } as any;

        interceptor = new AuthInterceptor(authServiceMock as any);
    });

    it('should add Authorization header when token exists', () => {
        authServiceMock.getToken.mockReturnValue('fake-token');
        const req = new HttpRequest('GET', '/test');
        interceptor.intercept(req, nextMock);
        expect(nextMock.handle).toHaveBeenCalledTimes(1);
        const handleReq = nextMock.handle.mock.calls[0][0] as HttpRequest<any>;
        expect(handleReq.headers.get('Authorization')).toBe('Bearer fake-token');
    });

    it('should not add Authorization header when no token', () => {
        authServiceMock.getToken.mockReturnValue(null);
        const req = new HttpRequest('GET', '/test');
        interceptor.intercept(req, nextMock);
        expect(nextMock.handle).toHaveBeenCalledTimes(1);
        const handleReq = nextMock.handle.mock.calls[0][0] as HttpRequest<any>;
        expect(handleReq.headers.has('Authorization')).toBe(false);
    })
});