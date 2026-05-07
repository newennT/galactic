import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminListUsersItemComponent } from './admin-list-users-item.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('AdminListUsersItemComponent', () => {
    let component: AdminListUsersItemComponent;
    let fixture: ComponentFixture<AdminListUsersItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminListUsersItemComponent],
            imports: [RouterTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminListUsersItemComponent);
        component = fixture.componentInstance;

        component.adminUser = {
            id_user: 1,
            username: 'test',
            email: 'test@test.com',
            is_admin: true
        } as any;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should receive adminUser input', () => {
        expect(component.adminUser).toBeTruthy();
    });

    it('should contain correct user id', () => {
        expect(component.adminUser.id_user).toBe(1);
    });

    it('should contain correct username', () => {
        expect(component.adminUser.username).toBe('test');
    });

    it('should contain correct email', () => {
        expect(component.adminUser.email).toBe('test@test.com');
    });
});