import { ComponentFixture, tick } from "@angular/core/testing";
import { RegisterComponent } from "./register.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { AuthService } from "src/app/core/services/auth.service";
import { Router } from "@angular/router";
import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { throwError } from "rxjs";

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let authServiceMock: any;
    let routerMock: any;

    beforeEach(async () => {
        authServiceMock = {
            register: jest.fn(),
            logout: jest.fn(),
            isLogged: jest.fn().mockReturnValue(false)
        };

        routerMock = {
            navigate: jest.fn()
        };

        await TestBed.configureTestingModule({
            declarations: [RegisterComponent],
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
        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be invalid when form is empty', () => {
        expect(component.registerForm.valid).toBe(false);
    });

    it('should be valid when form is filled', () => {
        component.registerForm.setValue({
            username: 'john',
            email: 'john@test.com',
            confirmEmail: 'john@test.com',
            password: '1234',
            confirmPassword: '1234'
        });

        expect(component.registerForm.valid).toBe(true);
    });

    it('should not submit if form is invalid', () => {
        component.registerForm.reset();
        component.onSubmit();
        expect(authServiceMock.register).not.toHaveBeenCalled();
    });

    it('should call register and navigate on success', () => {
        component.registerForm.setValue({
            username: 'john',
            email: 'john@test.com',
            confirmEmail: 'john@test.com',
            password: '1234',
            confirmPassword: '1234'
        });

        authServiceMock.register.mockReturnValue(of({}));

        component.onSubmit();

        expect(component.loading).toBe(true);
        expect(authServiceMock.register).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should stop loading on error', () => {
        component.registerForm.setValue({
            username: 'john',
            email: 'john@test.com',
            confirmEmail: 'john@test.com',
            password: '1234',
            confirmPassword: '1234'
        });

        authServiceMock.register.mockReturnValue(throwError(() => new Error('fail')));

        component.onSubmit();

        expect(component.loading).toBe(false);
    });

    it('should call logout', () => {
        component.logout();
        expect(authServiceMock.logout).toHaveBeenCalled();
    });
});