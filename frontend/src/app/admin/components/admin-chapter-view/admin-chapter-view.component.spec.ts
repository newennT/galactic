import { DragDropModule } from "@angular/cdk/drag-drop";
import { AdminChapterViewComponent } from "./admin-chapter-view.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from 'rxjs';
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute } from "@angular/router";
import { AdminChapterNavigatorService } from "../../services/admin-chapterNavigator.service";
import { AdminChapterExercisesService } from "../../services/admin-chapterExercises.service";
import { AdminChaptersService } from "../../services/admin-chapters.service";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe('AdminChapterViewComponent', () => {
    let component: AdminChapterViewComponent;
    let fixture: ComponentFixture<AdminChapterViewComponent>;

    const mockChapter = {
        id_chapter: 1,
        title: "Titre test",
        Pages: []
    };

    const activatedRouteMock = {
        data: of({ adminChapter: mockChapter })
    };

    const adminChapterNavigatorServiceMock = {
        reset: jest.fn(),
        next: jest.fn(),
        isConclusion: jest.fn(),
        isContent: jest.fn()
    };

    const exercisesMock = {
        validateUnique: jest.fn(),
        selectPair: jest.fn(),
        moveOrderItem: jest.fn(),
        validateOrder: jest.fn()
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminChapterViewComponent],
            imports: [
                RouterTestingModule,
                FormsModule,
                NoopAnimationsModule,
                DragDropModule,
                MatButtonModule
            ],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: AdminChapterNavigatorService, useValue: adminChapterNavigatorServiceMock },
                { provide: AdminChapterExercisesService, useValue: exercisesMock }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminChapterViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should reset navigator on init', () => {
        component.ngOnInit();
        expect(adminChapterNavigatorServiceMock.reset).toHaveBeenCalled();
    });

    it('should render conclusion page when navigator returns true', () => {
        adminChapterNavigatorServiceMock.isConclusion.mockReturnValue(true);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.page-conclusion')).toBeTruthy();
    });



    //   Exercices

    it('should validate unique exercise through service', () => {
        exercisesMock.validateUnique.mockReturnValue(true);
        component.validateUnique({ id_page: 1 } as any);
        expect(exercisesMock.validateUnique).toHaveBeenCalled();
    });

    it('should call selectPair service', () => {
        exercisesMock.selectPair.mockReturnValue(false);
        component.selectPairs(
            {} as any,
            { id_page: 1 } as any
        );

        expect(exercisesMock.selectPair).toHaveBeenCalled();
    });

    it('should show feedback when pairs exercise is completed', () => {
        exercisesMock.selectPair.mockReturnValue(true);
        component.selectPairs(
            {} as any,
            { id_page: 1 } as any
        );
        expect(component.showFeedback[1]).toBe(true);
        expect(component.isCorrect[1]).toBe(true);
    });

    it('should move order item via service', () => {
        component.drop(
            { previousIndex: 0, currentIndex: 1 } as any,
            { id_page: 1 } as any
        );
        expect(exercisesMock.moveOrderItem).toHaveBeenCalled();
    });

    it('should validate order via service', () => {
        exercisesMock.validateOrder.mockReturnValue(true);
        component.validateOrder({ id_page: 1 } as any);
        expect(exercisesMock.validateOrder)
        .toHaveBeenCalled();
    });
});