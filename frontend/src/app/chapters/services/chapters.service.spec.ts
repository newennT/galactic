import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ChaptersService } from './chapters.service';
import { environment } from '../../../environments/environment';
import { Chapter } from 'src/app/core/models/chapter.model';

describe('ChaptersService', () => {
    let service: ChaptersService;
    let httpTestingController: HttpTestingController;
    const apiUrl = environment.apiUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ChaptersService]
        });
        service = TestBed.inject(ChaptersService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('fetch all chapters', () => {
        const mockResponse = {
            message: 'Success',
            data: [{ id_chapter: 1, title: 'Chapter 1', title_fr: 'Chapitre 1', isPublished: true, id_level: 1, order: 1, abstract: 'Lorem ipsum blblbllblblbl'} as Chapter]
        };

        service.getChapters().subscribe(chapters => {
            expect(chapters.length).toBe(1);
            expect(chapters[0].id_chapter).toBe(1);
            expect(chapters[0].title).toBe('Chapter 1');
            expect(chapters[0].title_fr).toBe('Chapitre 1');
            expect(chapters[0].isPublished).toBe(true);
            expect(chapters[0].id_level).toBe(1);
            expect(chapters[0].order).toBe(1);
            expect(chapters[0].abstract).toBe('Lorem ipsum blblbllblblbl');
        });

        const req = httpTestingController.expectOne(`${apiUrl}/chapters`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });
});