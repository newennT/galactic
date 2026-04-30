import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, TokenPayload } from './auth.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';


jest.mock('jwt-decode');

describe('AuthService', () => {
    let service: AuthService;
    let httpTestingController: HttpTestingController;
    let routerMock: any;

    beforeEach(() => {
        routerMock = {
            navigate: jest.fn()
        };

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthService,
                { provide: Router, useValue: routerMock }
            ]
        });

        service = TestBed.inject(AuthService);
        httpTestingController = TestBed.inject(HttpTestingController);

        localStorage.clear();
        jest.clearAllMocks();
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('login and store token', () => {
        const credentials = { email: 'test@test.com', password: '1234' };
        const mockResponse = { token: 'fake-token' };

        service.login(credentials).subscribe(res => {
            expect(res).toEqual(mockResponse);
            expect(localStorage.getItem('token')).toBe('fake-token');
        });

        const req = httpTestingController.expectOne(`${environment.apiUrl}/login`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(credentials);
        req.flush(mockResponse);
    });

    it('register and store token', () => {
        const credentials = { email: 'test@test.com', password: '1234' };
        const mockResponse = { token: 'new-token' };

        service.register(credentials).subscribe(res => {
            expect(res).toEqual(mockResponse);
            expect(localStorage.getItem('token')).toBe('new-token');
        });

        const req = httpTestingController.expectOne(`${environment.apiUrl}/register`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(credentials);
        req.flush(mockResponse);
    })

    it('return token from localStorage', () => {
        localStorage.setItem('token', 'fake-token');
        expect(service.getToken()).toBe('fake-token');
    });

    it('return true if token exists', () => {
        localStorage.setItem('token', 'fake-token');
        expect(service.isLogged()).toBe(true);
    });

    it('return false if token does not exist', () => {
        expect(service.isLogged()).toBe(false);
    });

    it('logout', () => {
        localStorage.setItem('token', 'fake-token');
        service.logout();
        expect(localStorage.getItem('token')).toBeNull();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/logout']);
    });

    it('return null if no token', () => {
        expect(service.getPayload()).toBeNull();
    });

    it('decode token and return payload', () => {
        const fakePayload: TokenPayload = {
            id_user: 1,
            is_admin: true
        };

        localStorage.setItem('token', 'fake-token');
        
        (jwt_decode as jest.Mock).mockReturnValue(fakePayload);
        const payload = service.getPayload();
        expect(jwt_decode).toHaveBeenCalledWith('fake-token');
        expect(payload).toEqual(fakePayload);
    });

    it('return false if not admin', () => {
        const fakePayload: TokenPayload = {
            id_user: 1,
            is_admin: false
        };

        (jwt_decode as jest.Mock).mockReturnValue(fakePayload);
        localStorage.setItem('token', 'token');
        expect(service.isAdmin()).toBe(false);
    });

    it('return false if no payload', () => {
        expect(service.isAdmin()).toBe(false);
    });
        
})