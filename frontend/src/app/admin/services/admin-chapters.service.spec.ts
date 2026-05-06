import { HttpTestingController } from "@angular/common/http/testing";
import { AdminChaptersService } from "./admin-chapters.service";
import { Chapter } from "src/app/core/models/chapter.model";
import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { environment } from "src/environments/environment";

describe('AdminChaptersService', () => {

    let service: AdminChaptersService;
    let httpMock: HttpTestingController;

    const mockChapters: Chapter[] = [
        { id_chapter: 1, title: 'testchapter1', order: 1 } as Chapter,
        { id_chapter: 2, title: 'testchapter2', order: 2 } as Chapter
    ];

    const mockChapter: Chapter = { id_chapter: 1, title: 'testchapter1', order: 1 } as Chapter;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(AdminChaptersService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get chapters', () => {
        service.getChapters().subscribe(chapters => {
            expect(chapters).toEqual(mockChapters);
            expect(chapters.length).toBe(2);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/chapters`);
        expect(req.request.method).toBe('GET');
        req.flush(mockChapters);
    });

    it('should get chapter by id', () => {
        service.getChapterById(1).subscribe(chapter => {
            expect(chapter).toEqual(mockChapter);
            expect(chapter.id_chapter).toBe(1);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/chapters/1`);
        expect(req.request.method).toBe('GET');
        req.flush(mockChapter);
    });

    it('should reorder chapters', () => {
        const payload = [
            { id_chapter: 1, order: 2 },
            { id_chapter: 2, order: 1 }
        ];

        service.reorder(payload).subscribe(response => {
            expect(response).toBeTruthy();
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/chapters/reorder`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual(payload);
        req.flush({});
    });

    it('should update chapter', () => {
        const payload = {
            title: 'updatedChapter'
        };
        service.updateChapter(1, payload).subscribe(chapter => {
            expect(chapter).toEqual(mockChapter);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/chapters/1/full`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(payload);
        req.flush(
            {
                message: 'Chapter updated',
                data: mockChapter
            }
        );
    });

    it('should create chapter', () => {
        const payload = {
            title: 'newChapter',
            order: 3
        };
        service.createChapter(payload).subscribe(chapter => {
            expect(chapter).toEqual(mockChapter);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/chapters/full`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(payload);
        req.flush(
            {
                message: 'Chapter created',
                data: mockChapter
            }
        );
    })
});