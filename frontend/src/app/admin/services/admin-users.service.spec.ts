import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AdminUsersService } from "./admin-users.service";
import { User } from "src/app/core/models/user.model";
import { TestBed } from "@angular/core/testing";
import { environment } from "src/environments/environment";

describe('AdminUsersService', () => {

    let service: AdminUsersService;
    let httpMock: HttpTestingController;

    const mockUsers = [
        { id_user: 1, username: 'testuser1', email: 'testuser1@example' } as User,
        { id_user: 2, username: 'testuser2', email: 'testuser2@example' } as User
    ];

    const mockUser: User = {
        id_user: 1,
        username: 'testuser',
        email: 'testuser@example'
    } as User;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(AdminUsersService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get users', () => {
        service.getUsers().subscribe(data => {
            expect(data).toEqual(mockUsers);
            expect(data.length).toBe(2);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/users`);
        expect(req.request.method).toBe('GET');
        req.flush(mockUsers);
    });

    it('should get user by id', () => {
        service.getUserById(1).subscribe(user => {
            expect(user).toEqual(mockUser);
            expect(user.id_user).toBe(1);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
        expect(req.request.method).toBe('GET');
        req.flush(mockUser);
    });

    it('should update user', () => {
        const payload = {
            username: 'updatedUser'
        };
        service.updateUser(1, payload).subscribe(user => {
            expect(user).toEqual(mockUser);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(payload);
        req.flush(
            {
                message: 'User updated successfully',
                data: mockUser
            }
        );
    });

    it('should create user', () => {
        const payload = {
            username: 'newUser',
            email: 'newUser@example',
            password: 'password'
        };
        service.createUser(payload).subscribe(user => {
            expect(user).toEqual(mockUser);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/users`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(payload);
        req.flush(mockUser);
    });
});