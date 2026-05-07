import { ComponentFixture } from "@angular/core/testing";
import { AdminListUsersComponent } from "./admin-list-users.component";
import { of } from "rxjs";
import { TestBed } from "@angular/core/testing";
import { AdminUsersService } from "../../services/admin-users.service";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe('AdminListUsersComponent', () => {
    let component: AdminListUsersComponent;
    let fixture: ComponentFixture<AdminListUsersComponent>;

    const mockUsers = [
        {
            id_user: 1,
            email: 'email',
            username: 'username',
            is_admin: true
        }, 
        {
            id_user: 2,
            email: 'email',
            username: 'username2',
            is_admin: false
        }
    ];

    const activatedRouteMock = {
        data: of({
            adminUsers: mockUsers
        })
    };

    const adminUsersServiceMock = {};

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminListUsersComponent],
            imports: [RouterTestingModule],
            providers: [
                { provide: AdminUsersService, useValue: adminUsersServiceMock },
                { provide: ActivatedRoute, useValue: activatedRouteMock }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
        fixture = TestBed.createComponent(AdminListUsersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize adminUsers', (done) => {
        component.adminUsers$.subscribe(data => {
            expect(data).toEqual(mockUsers);
            done();
        });
    });

    it('should copy users into users array on init', () => {
        expect(component.users).toEqual(mockUsers);
    });

    it('should create a new array reference for users', () => {
        expect(component.users).not.toBe(mockUsers);
    });

    it('should contain the correct number of users', () => {
        expect(component.users.length).toBe(2);
    });

    it('should contain expected user data', () => {
        expect(component.users[0]).toEqual(mockUsers[0]);
        expect(component.users[1]).toEqual(mockUsers[1]);
    });
})