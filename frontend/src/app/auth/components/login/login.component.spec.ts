import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceMock: any;
    let routerMock: any;

    beforeEach(async () => {
        login: jest.fn();
        logout: jest.fn();
        isLogged: jest.fn().mockReturnValue(false);

        routerMock = {
            navigate: jest.fn()
        };

        authServiceMock = {
            login: jest.fn(),
            logout: jest.fn(),
            isLogged: jest.fn().mockReturnValue(false)
        };

        await TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                NoopAnimationsModule
            ],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have invalid form if empty', () => {
        expect(component.loginForm.invalid).toBe(true);
    });

    it('should validate email format', () => {
        component.loginForm.setValue({
            email: 'not-an-email',
            password: 'password'
        });

        expect(component.loginForm.invalid).toBe(true);
    });

    it('should have valid form', () => {
        component.loginForm.setValue({
            email: 'test@test.com',
            password: 'password'
        });

        expect(component.loginForm.valid).toBe(true);
    });

    it('should login and navigate to dashboard', () => {
        authServiceMock.login.mockReturnValue(of({}));

        component.loginForm.setValue({
            email: 'test@test.com',
            password: 'password'
        });

        component.onLogin();

        expect(authServiceMock.login).toHaveBeenCalledWith({
            email: 'test@test.com',
            password: 'password'
        });
        expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should stop loading if login fails', () => {
        authServiceMock.login.mockReturnValue(
            throwError(() => new Error('Login failed'))
        );

        component.loginForm.setValue({
            email: 'test@test.com',
            password: 'password'
        });

        component.onLogin();

        expect(component.loading).toBe(false);
    })

    it('should not call login if form invalid', () => {
        component.loginForm.setValue({
            email: '',
            password: ''
        });

        component.onLogin();

        expect(authServiceMock.login).not.toHaveBeenCalled();
    });

    it('should logout', () => {
        component.logout();
        expect(authServiceMock.logout).toHaveBeenCalled();
    });


});