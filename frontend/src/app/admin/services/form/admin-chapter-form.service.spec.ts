import { TestBed } from "@angular/core/testing";
import { AdminChapterFormService } from "./admin-chapter-form.service";
import { FormBuilder } from '@angular/forms';
import { FormArray } from "@angular/forms";
import { AdminExerciseFormService } from "./admin-exercise-form.service";

describe('AdminChapterFormService', () => { 

    let service: AdminChapterFormService;

    const exerciseMockService = {
        createExerciseGroup: jest.fn().mockReturnValue(
            new FormBuilder().group({
                question: ['']
            })
        )
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AdminChapterFormService,
                FormBuilder,
                { provide: AdminExerciseFormService, useValue: exerciseMockService }
            ]
        });

        service = TestBed.inject(AdminChapterFormService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });


    // Création du formulaire

    it('should init form with chapter data', () => {
        const chapter: any = {
            title : 'test',
            title_fr : 'test',
            abstract : 'test',
            id_level : 1,
            Pages : []
        };
        const form = service.initForm(chapter);
        expect(form.value.title).toBe('test');
        expect(form.value.title_fr).toBe('test');
        expect(form.value.abstract).toBe('test');
        expect(form.value.id_level).toBe(1);
        expect(form.value.pages.length).toBe(0);
        expect(form.get('pages')).toBeDefined();
       
    });

    it('should init empty form', () => {
        const form = service.initEmptyForm();
        expect(form.value.title).toBe('');
        expect(form.value.title_fr).toBe('');
        expect(form.value.abstract).toBe('');
        expect(form.value.id_level).toBe('');
        expect(form.value.pages.length).toBe(0);
        expect(form.get('pages')).toBeDefined();
       
    });


    // Création de Page

    it('should map Pages into FormArray in initForm', () => {
        const chapter: any = {
            title: 'test',
            title_fr: 'test',
            abstract: 'test',
            id_level: 1,
            Pages: [
            {
                id_page: 1,
                type: 'LESSON',
                order_index: 1,
                Lesson: {
                title: 'lesson',
                content: 'content'
                },
                Exercise: {}
            }
            ]
        };
        const form = service.initForm(chapter);
        const pages = form.get('pages') as FormArray;
        expect(pages.length).toBe(1);
        expect(pages.at(0).value.id_page).toBe(1);
        expect(pages.at(0).value.type).toBe('LESSON');
    });

    it('should map Pages when defined', () => {
        const chapter: any = {
            title: 't',
            title_fr: 't',
            abstract: 't',
            id_level: 1,
            Pages: [
            {
                id_page: 1,
                type: 'LESSON',
                order_index: 1,
                Lesson: { title: 'a', content: 'b' },
                Exercise: {}
            }
            ]
        };
        const form = service.initForm(chapter);
        const pages = form.get('pages') as FormArray;
        expect(pages.length).toBe(1);
    });

    it('should fallback to empty array when Pages is undefined', () => {
        const chapter: any = {
            title: 't',
            title_fr: 't',
            abstract: 't',
            id_level: 1
        };
        const form = service.initForm(chapter);
        const pages = form.get('pages') as FormArray;
        expect(pages.length).toBe(0);
    });

    it('should fallback to empty array when Pages is null', () => {
        const chapter: any = {
            title: 't',
            title_fr: 't',
            abstract: 't',
            id_level: 1,
            Pages: null
        };
        const form = service.initForm(chapter);
        const pages = form.get('pages') as FormArray;
        expect(pages.length).toBe(0);
    });

    it('should create page group', () => {
        const page: any = {
            id_page: 1,
            type: 'LESSON',
            order_index: 1,
            Lesson: {
                title: 'test',
                content: 'test'
            },
            Exercise: {}
        };
        const group = service.createPageGroup(page);
        expect(group.value.id_page).toBe(1);
        expect(group.value.type).toBe('LESSON');
        expect(group.value.order_index).toBe(1);
        expect(group.value.lesson.title).toBe('test');
        expect(group.value.lesson.content).toBe('test');
        expect(group.value.exercise).toBeDefined();
        expect(exerciseMockService.createExerciseGroup).toHaveBeenCalled();
    });

    it('should create page group with fallback values', () => {
        const page: any = {
            id_page: 1,
            type: 'LESSON',
            order_index: 2
        };
        const group = service.createPageGroup(page);
        expect(group.value.id_page).toBe(1);
        expect(group.value.type).toBe('LESSON');
        expect(group.value.order_index).toBe(2);
        expect(group.value.lesson.title).toBe('');
        expect(group.value.lesson.content).toBe('');
    });

    it('should use fallback values for id_page and type when missing', () => {
        const page: any = {
            order_index: 5,
            Lesson: {
                title: 'test',
                content: 'test'
            },
            Exercise: {}
        };
        const group = service.createPageGroup(page);
        expect(group.value.id_page).toBe(0);
        expect(group.value.type).toBe('LESSON');
        expect(group.value.order_index).toBe(5);
    });

    it('should fallback when page is null', () => {
        const group = service.createPageGroup(null);
        expect(group.value.id_page).toBe(0);
        expect(group.value.type).toBe('LESSON');
    });



    // Création de lesson

    it('should create lesson group', () => {
        const lesson = {
            title: 'test',
            content: 'test'
        };
        const group = service.createLessonGroup(lesson);
        expect(group.value.title).toBe('test');
        expect(group.value.content).toBe('test');
    });

    it('should create lesson group with data', () => {
        const lesson = {
            title: 't',
            content: 'c'
        };
        const group = service.createLessonGroup(lesson);
        expect(group.value.title).toBe('t');
        expect(group.value.content).toBe('c');
    });

    it('should create lesson group with fallback values', () => {
        const group = service.createLessonGroup(undefined);
        expect(group.value.title).toBe('');
        expect(group.value.content).toBe('');
    });




    it('should get page FormArray', () => {
        const form = service.initEmptyForm();
        const pages = service.getPages(form);
        expect(pages instanceof FormArray).toBe(true);
    });

    it('should add page', () => {
        const form = service.initEmptyForm();
        service.addPage(form);
        const pages = service.getPages(form);
        expect(pages.length).toBe(1);
        expect(pages.at(0).value.type).toBe('LESSON');
        expect(pages.at(0).value.order_index).toBe(1);
    });

    it('should remove page and reindex', () => {
        const form = service.initEmptyForm();
        service.addPage(form);
        service.addPage(form);
        service.removePage(form, 0);
        const pages = service.getPages(form);
        expect(pages.length).toBe(1);
        expect(pages.at(0).value.order_index).toBe(1);
    });

    it('should move page up', () => {
        const form = service.initEmptyForm();
        service.addPage(form);
        service.addPage(form);
        const pages = service.getPages(form);
        pages.at(0).get('type')?.setValue('A');
        pages.at(1).get('type')?.setValue('B');
        service.movePageUp(form, 1);
        expect(pages.at(0).value.type).toBe('B');
        expect(pages.at(1).value.type).toBe('A');
    });

    it('should not move first page up', () => {
        const form = service.initEmptyForm();
        service.addPage(form);
        const pages = service.getPages(form);
        const initialOrder = pages.at(0).value.order_index;
        service.movePageUp(form, 0);
        expect(pages.at(0).value.order_index).toBe(initialOrder);
    });

    it('should move page down', () => {
        const form = service.initEmptyForm();
        service.addPage(form);
        service.addPage(form);
        const pages = service.getPages(form);
        pages.at(0).get('type')?.setValue('A');
        pages.at(1).get('type')?.setValue('B');
        service.movePageDown(form, 0);
        expect(pages.at(0).value.type).toBe('B');
        expect(pages.at(1).value.type).toBe('A');
    });

    it('should not move last page down', () => {
        const form = service.initEmptyForm();
        service.addPage(form);
        const pages = service.getPages(form);
        const initialOrder = pages.at(0).value.order_index;
        service.movePageDown(form, 0);
        expect(pages.at(0).value.order_index).toBe(initialOrder);
    });

 });