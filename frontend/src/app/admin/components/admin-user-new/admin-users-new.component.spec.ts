import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { AdminUserNewComponent } from "./admin-user-new.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AdminUsersService } from "../../services/admin-users.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { of } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { RouterTestingModule } from "@angular/router/testing";

describe('AdminUserNewComponent', () => {
    let component: AdminUserNewComponent;
    let fixture: ComponentFixture<AdminUserNewComponent>;

    const routerMock = {
        navigate: jest.fn()
    };

    const activatedRouteMock = {
        snapshot: {
            params: {}
        }
    };

    const adminUsersServiceMock = {
        getUserById: jest.fn().mockReturnValue(of({
            username: 'testuser',
            email: 'testuser@example.com',
            is_admin: true
        })),
        createUser: jest.fn().mockReturnValue(of({})),
        updateUser: jest.fn().mockReturnValue(of({}))
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminUserNewComponent],
            imports: [
                ReactiveFormsModule,
                MatCheckboxModule,
                RouterTestingModule
            ],
            providers: [
                { provide: AdminUsersService, useValue: adminUsersServiceMock },
                { provide: Router, useValue: routerMock },
                { provide: ActivatedRoute, useValue: activatedRouteMock }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminUserNewComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
        component.userForm.updateValueAndValidity();    
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be in create mode by default', () => {
        expect(component.isEditMode).toBe(false);
    });

    it('should validate email format', () => {
        const control = component.userForm.get('email');
        control?.setValue('invalid-email');
        expect(control?.valid).toBe(false);
    });

    it('should switch to edit mode when id exists', () => {
        activatedRouteMock.snapshot.params = { id: 1 };

        component.ngOnInit();

        expect(component.isEditMode).toBe(true);
        expect(component.userId).toBe(1);
    });

    it('should load user and patch form values', () => {
        component.userId = 1;

        component.loadUser();

        expect(adminUsersServiceMock.getUserById).toHaveBeenCalledWith(1);

        expect(component.userForm.value.username).toBe('testuser');
        expect(component.userForm.value.email).toBe('testuser@example.com');
        expect(component.userForm.value.is_admin).toBe(true);
    });

    it('should not submit when form is invalid', () => {
        component.userForm.patchValue({
            username: '',
            email: '',
            password: ''
        });

        component.onSubmit();

        expect(adminUsersServiceMock.createUser).not.toHaveBeenCalled();
        expect(adminUsersServiceMock.updateUser).not.toHaveBeenCalled();
    });

    
    it('should update user in edit mode', () => {
        component.isEditMode = true;
        component.userId = 1;

        component.userForm.patchValue({
            username: 'updated',
            email: 'updated@test.com',
            password: '',
            is_admin: true
        });

        component.onSubmit();

        expect(adminUsersServiceMock.updateUser).toHaveBeenCalledWith(
            1,
            {
                username: 'updated',
                email: 'updated@test.com',
                password: '',
                is_admin: true
            }
        );

        expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/users']);
    });

    it('should create user in create mode and navigate', () => {
    component.isEditMode = false;

    component.userForm.patchValue({
        username: 'test',
        email: 'test@test.com',
        password: '123456',
        is_admin: true
    });

    component.onSubmit();

    expect(adminUsersServiceMock.createUser).toHaveBeenCalledWith({
        username: 'test',
        email: 'test@test.com',
        password: '123456',
        is_admin: true
    });

    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/users']);
});
});