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

  it('should render conclusion page when navigator returns true', () => {
    navigatorMock.isConclusion.mockReturnValue(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.page-conclusion')).toBeTruthy();
  });





//   Exercices

  it('should validate unique exercise through service', () => {
    exercisesMock.validateUnique.mockReturnValue(true);
    component.validateUnique({ id_page: 1 } as any);
    expect(exercisesMock.validateUnique)
      .toHaveBeenCalled();
  });

  it('should call saveResult when user is logged in (validateUnique)', () => {
    authServiceMock.isLogged.mockReturnValue(true);
    const saveResultSpy = jest.spyOn(userExerciseServiceMock, 'saveResult')
      .mockReturnValue(of({}));
    const page = { id_page: 1 } as any;
    exercisesMock.validateUnique.mockReturnValue(true);
    component.validateUnique(page);
    expect(saveResultSpy).toHaveBeenCalledWith(1, true);
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

  it('should call saveResult when pair exercise is completed and user is logged', () => {
    authServiceMock.isLogged.mockReturnValue(true);
    const saveResultSpy = jest.spyOn(userExerciseServiceMock, 'saveResult')
      .mockReturnValue(of({}));

    const page = {
      id_page: 1
    } as any;
    exercisesMock.selectPair.mockReturnValue(true);

    component.selectPairs(
      { id_response: 1, pair_key: 'A' } as any,
      page
    );

    expect(saveResultSpy).toHaveBeenCalledWith(1, true);
  });

  it('should NOT call saveResult if user is not logged', () => {
    authServiceMock.isLogged.mockReturnValue(false);
    const saveResultSpy = jest.spyOn(userExerciseServiceMock, 'saveResult');
    exercisesMock.selectPair.mockReturnValue(true);
    component.selectPairs(
      { id_response: 1, pair_key: 'A' } as any,
      { id_page: 1 } as any
    );
    expect(saveResultSpy).not.toHaveBeenCalled();
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

  it('should call saveResult when user is logged in (validateOrder)', () => {
    authServiceMock.isLogged.mockReturnValue(true);
    const saveResultSpy = jest.spyOn(userExerciseServiceMock, 'saveResult')
      .mockReturnValue(of({}));
    exercisesMock.validateOrder.mockReturnValue(true);
    const page = { id_page: 1 } as any;
    component.validateOrder(page);
    expect(saveResultSpy).toHaveBeenCalledWith(1, true);
  });

  it('should NOT call saveResult when user is not logged in (validateOrder)', () => {
    authServiceMock.isLogged.mockReturnValue(false);
    const saveResultSpy = jest.spyOn(userExerciseServiceMock, 'saveResult');
    exercisesMock.validateOrder.mockReturnValue(true);
    component.validateOrder({ id_page: 1 } as any);
    expect(saveResultSpy).not.toHaveBeenCalled();
  });



//   Graphique 

  it('should load score and update chart on conclusion', () => {
    jest.useFakeTimers();
    authServiceMock.isLogged.mockReturnValue(true);
    navigatorMock.next.mockReturnValue(true);
    navigatorMock.isConclusion.mockReturnValue(true);
    userExerciseServiceMock.getChapterScore.mockReturnValue(of({
      total: 5,
      correct: 3,
      percentage: 60
    }));
    component.scoreChart = {nativeElement: document.createElement('canvas')} as any;
    component.nextPage(mockChapter as any);
    jest.runAllTimers();
    expect(userExerciseServiceMock.getChapterScore).toHaveBeenCalled();
    expect(scoreChartMock.render).toHaveBeenCalled();
  });

  it('should render score chart via service', () => {
    component.correctExercises = 2;
    component.totalExercises = 5;
    component.scoreChart = { nativeElement: document.createElement('canvas')} as any;
    component.updateScoreChart();
    expect(scoreChartMock.render).toHaveBeenCalled();
  });

  it('should return early when scoreChart is missing', () => {
    component.scoreChart = undefined as any;
    component.correctExercises = 2;
    component.totalExercises = 5;
    component.updateScoreChart();
    expect(scoreChartMock.render).not.toHaveBeenCalled();
  });

  it('should return early when correctExercises is undefined', () => {
    component.scoreChart = {
      nativeElement: document.createElement('canvas')
    } as any;
    component.correctExercises = undefined;
    component.totalExercises = 5;
    component.updateScoreChart();
    expect(scoreChartMock.render).not.toHaveBeenCalled();
  });

  it('should return early when totalExercises is undefined', () => {
    component.scoreChart = {
      nativeElement: document.createElement('canvas')
    } as any;
    component.correctExercises = 2;
    component.totalExercises = undefined;
    component.updateScoreChart();
    expect(scoreChartMock.render).not.toHaveBeenCalled();
  });

  it('should render chart when all values exist', () => {
    component.scoreChart = {
      nativeElement: document.createElement('canvas')
    } as any;
    component.correctExercises = 2;
    component.totalExercises = 5;
    component.updateScoreChart();
    expect(scoreChartMock.render).toHaveBeenCalled();
  });
});