import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { UserChapterService, UserChaptersResponse } from "./userChapter.service";
import { TestBed } from "@angular/core/testing";
import { environment } from "src/environments/environment";

describe('UserChapterService', () => {
    let userChapterService: UserChapterService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        userChapterService = TestBed.inject(UserChapterService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch user chapters', () => {
        const mockResponse: UserChaptersResponse = {
            user: {
                id_user: 1,
                username: 'testuser'
            } as any,
            chapters: []
        };

        userChapterService.getUserChapters().subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/user-chapters`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });
});