import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { environment } from "src/environments/environment";
import { AdminLevelService } from "./admin-level.service";
import { Level } from "src/app/core/models/level.model";

describe('AdminUsersService', () => {

    let service: AdminLevelService;
    let httpMock: HttpTestingController;

    const mockLevels = [
        { id_level: 1, title: 'testlevel1' } as Level,
        { id_level: 2, title: 'testlevel2' } as Level
    ];



    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(AdminLevelService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get levels', () => {
        service.getLevels().subscribe(response => {
            expect(response.data).toEqual(mockLevels);
            expect(response.data.length).toBe(2);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/levels`);
        expect(req.request.method).toBe('GET');
        req.flush({
            message: 'Success',
            data: mockLevels
        });
    });
    
});