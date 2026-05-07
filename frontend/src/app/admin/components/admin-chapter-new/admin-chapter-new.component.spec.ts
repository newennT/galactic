import { ComponentFixture } from "@angular/core/testing";
import { AdminChapterNewComponent } from "./admin-chapter-new.component";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { of, throwError } from "rxjs";
import { AdminLevelService } from "../../services/admin-level.service";
import { AdminChaptersService } from "../../services/admin-chapters.service";
import { AdminChapterFormService } from "../../services/form/admin-chapter-form.service";
import { AdminExerciseFormService } from "../../services/form/admin-exercise-form.service";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { UniqueResponses } from "src/app/core/models/uniqueResponses.model";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { EditorModule } from "@tinymce/tinymce-angular";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";

describe('AdminChapterNewComponent', () => {
    let component: AdminChapterNewComponent;
    let fixture: ComponentFixture<AdminChapterNewComponent>;

    const fb = new FormBuilder();

    const mockPage = fb.group({
        id_page: [1],
        type: ['LESSON'],
        order_index: [1],
        lesson: fb.group({
            title: [''],
            content: ['']
        }),
        exercise: fb.group({
            question: [''],
            type: ['UNIQUE'],
            feedback: [''],
            media_type: [''],
            media_url: [''],
            uniqueResponses: fb.array([]),
            pairs: fb.array([]),
            putInOrders: fb.array([]),
            orderText: ['']
        })
    })
    
    const mockForm = fb.group({
        title: [''],
        title_fr: [''],
        abstract: [''],
        id_level: [''],

        pages: fb.array([mockPage])
    });

    const activatedRouteMock = {
        snapshot: {
            paramMap: {
                get: jest.fn().mockReturnValue('1')
            }
        },
        data: of({})
    };

    const routerMock = {
        navigate: jest.fn()
    }

    const adminLevelServiceMock = {
        getLevels: jest.fn().mockReturnValue(
            of({
                data: [
                    { id_level: 1, name: 'A1' },
                ]
            })
        )
    };

    const adminChaptersServiceMock = {
        createChapter: jest.fn().mockReturnValue(of({}))
    };

    const adminExerciseFormServiceMock = {
        addUniqueResponse: jest.fn(),
        removeUniqueResponse: jest.fn(),
        addPair: jest.fn(),
        removePair: jest.fn(),
        getOrderTextControl: jest.fn().mockReturnValue(new FormControl('test')),
        normalizeOrderExercises: jest.fn((v) => v)
    };

    const adminChapterFormServiceMock = {
        addPage: jest.fn(),
        removePage: jest.fn(),
        movePageUp: jest.fn(),
        movePageDown: jest.fn(),
        getPages: jest.fn().mockImplementation((form: FormGroup) => { return form.get('pages') as FormArray; }),        
        initEmptyForm: jest.fn().mockReturnValue(mockForm),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminChapterNewComponent],
            imports: [ReactiveFormsModule, MatSelectModule, MatFormFieldModule, MatInputModule, EditorModule, NoopAnimationsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                FormBuilder,
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: Router, useValue: routerMock },
                { provide: AdminLevelService, useValue: adminLevelServiceMock },
                { provide: AdminChaptersService, useValue: adminChaptersServiceMock },
                { provide: AdminChapterFormService, useValue: adminChapterFormServiceMock },
                { provide: AdminExerciseFormService, useValue: adminExerciseFormServiceMock }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(AdminChapterNewComponent);
        component = fixture.componentInstance;
        component.chapterForm = mockForm;
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize component', () => {
        expect(adminChapterFormServiceMock.initEmptyForm).toHaveBeenCalled();
    });

    it('should return pages FormArray', () => {
        expect(component.pages instanceof FormArray).toBe(true);
        expect(component.pages.length).toBe(1);
    });

    it('should toggle media visibility', () => {
        component.showMedia[0] = false;
        component.toggleMedia(0);
        expect(component.showMedia[0]).toBe(true);
    });


    // Gestion des pages 

    it('should add page', () => {
        component.chapterForm = mockForm;
        component.addPage();
        expect(adminChapterFormServiceMock.addPage).toHaveBeenCalledWith(mockForm);
    });

    it('should remove page', () => {
        component.chapterForm = mockForm;
        component.removePage(0);
        expect(adminChapterFormServiceMock.removePage).toHaveBeenCalledWith(mockForm, 0);
    });

    it('should move page up', () => {
        component.chapterForm = mockForm;
        component.movePageUp(1);
        expect(adminChapterFormServiceMock.movePageUp).toHaveBeenCalledWith(mockForm, 1);
    });

    it('should move page down', () => {
        component.chapterForm = mockForm;
        component.movePageDown(1);
        expect(adminChapterFormServiceMock.movePageDown).toHaveBeenCalledWith(mockForm, 1);
    });



    // UniqueResponses

    it('should add unique response', () => {
        component.chapterForm = mockForm;
        component.addUniqueResponse(0);
        expect(adminExerciseFormServiceMock.addUniqueResponse).toHaveBeenCalled();
    });

    it('should remove unique response', () => {
        component.chapterForm = mockForm;
        component.removeUniqueResponse(0, 1);
        expect(adminExerciseFormServiceMock.removeUniqueResponse).toHaveBeenCalled();
    });


    // Pairs 

    it('should add pair', () => {
        component.chapterForm = mockForm;
        component.addPairs(0);
        expect(adminExerciseFormServiceMock.addPair).toHaveBeenCalled();
    });

    it('should remove pair', () => {
        component.chapterForm = mockForm;
        component.removePairs(0, 1);
        expect(adminExerciseFormServiceMock.removePair).toHaveBeenCalled();
    });


    // order

    it('should get order text control', () => {
        component.chapterForm = mockForm;
        const result = component.getOrderTextControl(0);
        expect(result instanceof FormControl).toBe(true);
        expect(adminExerciseFormServiceMock.getOrderTextControl).toHaveBeenCalled();
    });

    it('should return putInOrders FormArray', () => {    
        component.chapterForm = mockForm;
        const result = component.getOrderArray(0);
        expect(result instanceof FormArray).toBe(true);
    });


    // Enregistrer le formulaire

    it('should not submit if form is invalid', () => {
        component.chapterForm = new FormBuilder().group({
            title: ['test'],
            id_level: ['1'],
            pages: fb.array([])
        });
        component.chapterForm.setErrors({invalid: true});
        component.onSubmit();
        expect(adminChaptersServiceMock.createChapter).not.toHaveBeenCalled();
    });

    it('should submit form and navigate', () => {
        component.chapterForm = new FormBuilder().group({
            pages: new FormBuilder().array([])
        });
        component.onSubmit();
        expect(adminExerciseFormServiceMock.normalizeOrderExercises).toHaveBeenCalledWith({
            pages: []
        });
        expect(adminChaptersServiceMock.createChapter).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/chapters']);
            
    });

    it('should handle submit error', () => {
        const consolSpy = jest.spyOn(console, 'log').mockImplementation();
        adminChaptersServiceMock.createChapter.mockReturnValueOnce(throwError(() => 'error'));
        component.chapterForm = new FormBuilder().group({
            pages: new FormBuilder().array([])
        });
        component.onSubmit();
        expect(consolSpy).toHaveBeenCalled();
        consolSpy.mockRestore();
    });

});