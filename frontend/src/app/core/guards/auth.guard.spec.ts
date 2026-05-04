import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  let authServiceMock: {
    isLogged: jest.Mock;
  };

  let routerMock: {
    navigate: jest.Mock;
  };

  beforeEach(() => {
    authServiceMock = {
      isLogged: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should allow access if user is logged in', () => {
    authServiceMock.isLogged.mockReturnValue(true);

    const result = guard.canActivate();

    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should block access and redirect to login if user is not logged in', () => {
    authServiceMock.isLogged.mockReturnValue(false);

    const result = guard.canActivate();

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});