import { TestBed } from "@angular/core/testing";
import { AdminGuard } from "./admin.guard";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

describe('AdminGuard', () => {
    let guard: AdminGuard;
    let authServiceMock: {
        isAdmin: jest.Mock
    };
    let routerMock: {
        navigate: jest.Mock
    };

    beforeEach(() => {
        authServiceMock = {
            isAdmin: jest.fn()
        };

        routerMock = {
            navigate: jest.fn()
        };

        TestBed.configureTestingModule({
            providers: [
                AdminGuard,
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock }
            ]
        });

        guard = TestBed.inject(AdminGuard);
    });

    it('should allow access if user is admin', () => {
        authServiceMock.isAdmin.mockReturnValue(true);
        const result = guard.canActivate();
        expect(result).toBe(true);
        expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to home if user is not admin', () => {
        authServiceMock.isAdmin.mockReturnValue(false);
        const result = guard.canActivate();
        expect(result).toBe(false);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });

});