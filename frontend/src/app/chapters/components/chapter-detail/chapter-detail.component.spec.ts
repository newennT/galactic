import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChapterDetailComponent } from './chapter-detail.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserExerciseService } from '../../services/userExercise.service';
import { ChaptersService } from '../../services/chapters.service';
import { ChapterNavigatorService } from '../../services/chapterNavigator.service';
import { ChapterExercisesService } from '../../services/chapterExercises.service';
import { ScoreChartService } from '../../services/scoreChart.service';

describe('ChapterDetailComponent', () => {

  let component: ChapterDetailComponent;
  let fixture: ComponentFixture<ChapterDetailComponent>;

  const mockChapter = {
    id_chapter: 1,
    title: 'Titre test',
    Pages: []
  };

  const activatedRouteMock = {
    data: of({ chapter: mockChapter })
  };

  const authServiceMock = {
    isLogged: jest.fn()
  };

  const userExerciseServiceMock = {
    saveResult: jest.fn(() => of({})),
    getChapterScore: jest.fn(() =>
      of({ total: 2, correct: 2, percentage: 100 })
    )
  };

  const chapterServiceMock = {
    startChapter: jest.fn(() => of({}))
  };

  const navigatorMock = {
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

  const scoreChartMock = {
    render: jest.fn(),
    destroy: jest.fn()
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [ChapterDetailComponent],
      imports: [
        RouterTestingModule,
        FormsModule,
        NoopAnimationsModule,
        DragDropModule,
        MatButtonModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserExerciseService, useValue: userExerciseServiceMock },
        { provide: ChaptersService, useValue: chapterServiceMock },

        { provide: ChapterNavigatorService, useValue: navigatorMock },
        { provide: ChapterExercisesService, useValue: exercisesMock },
        { provide: ScoreChartService, useValue: scoreChartMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ChapterDetailComponent);
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
    expect(navigatorMock.reset).toHaveBeenCalled();
  });



//   Commencer le chapitre 

  it('should start chapter if user is logged', () => {
    authServiceMock.isLogged.mockReturnValue(true);
    component.startChapter(1);
    expect(chapterServiceMock.startChapter)
      .toHaveBeenCalledWith(1);
  });

  it('should not start chapter if user is not logged', () => {
    authServiceMock.isLogged.mockReturnValue(false);
    component.startChapter(1);
    expect(chapterServiceMock.startChapter)
      .not.toHaveBeenCalled();
  });



//  Navigation

  it('should call navigator nextPage', () => {
    navigatorMock.next.mockReturnValue(true);
    navigatorMock.isConclusion.mockReturnValue(false);
    component.nextPage(mockChapter as any);
    expect(navigatorMock.next).toHaveBeenCalled();
  });



//   Exercices

  it('should validate unique exercise through service', () => {
    exercisesMock.validateUnique.mockReturnValue(true);
    component.validateUnique({ id_page: 1 } as any);
    expect(exercisesMock.validateUnique)
      .toHaveBeenCalled();
  });

  it('should call selectPair service', () => {
    exercisesMock.selectPair.mockReturnValue(false);
    component.selectPairs(
      {} as any,
      { id_page: 1 } as any
    );

    expect(exercisesMock.selectPair)
      .toHaveBeenCalled();
  });

  it('should move order item via service', () => {
    component.drop(
      { previousIndex: 0, currentIndex: 1 } as any,
      { id_page: 1 } as any
    );

    expect(exercisesMock.moveOrderItem)
      .toHaveBeenCalled();
  });

  it('should validate order via service', () => {

    exercisesMock.validateOrder.mockReturnValue(true);

    component.validateOrder({ id_page: 1 } as any);

    expect(exercisesMock.validateOrder)
      .toHaveBeenCalled();
  });



//   Graphique 

  it('should render score chart via service', () => {
    component.correctExercises = 2;
    component.totalExercises = 5;
    component.scoreChart = {
      nativeElement: document.createElement('canvas')
    } as any;
    component.updateScoreChart();
    expect(scoreChartMock.render)
      .toHaveBeenCalled();
  });
});