import { UserExerciseService } from "./userExercise.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AuthService } from "src/app/core/services/auth.service";
import { environment } from "src/environments/environment";
import { TestBed } from "@angular/core/testing";

describe('UserExerciseService', () => {
    let service: UserExerciseService;
    let httpTestingController: HttpTestingController;
    const apiUrl = environment.apiUrl;

    const authServiceMock = {
        getToken: jest.fn().mockReturnValue('fake-token')
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                UserExerciseService,
                { provide: AuthService, useValue: authServiceMock }
            ]
        });
        service = TestBed.inject(UserExerciseService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
        jest.clearAllMocks();
    });

    it('save test result',  () => {
        const mockResponse = { success: true };

        service.saveResult(1, true).subscribe(res => {
            expect(res).toEqual(mockResponse);
        });

        const req = httpTestingController.expectOne(`${apiUrl}/user-exercises`);
        expect(req.request.method).toBe('POST');

        expect(req.request.body).toEqual({ 
            id_page: 1, 
            is_correct: true 
        });
        req.flush(mockResponse);
    })

    it('get chapter score', () => {
        const mockResponse = {
            total: 10,
            correct: 5,
            percentage: 50
        };

        service.getChapterScore(5).subscribe(res =>{
            expect(res.total).toBe(10);
            expect(res.correct).toBe(5);
            expect(res.percentage).toBe(50);
        });

        const req = httpTestingController.expectOne(`${apiUrl}/user-exercises/chapter/5/score`);
        expect(req.request.method).toBe('GET');
        req.flush({ mockResponse })
        
    })
})
