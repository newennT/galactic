jest.mock('chart.js', () => {
    const ChartMock = Object.assign(
        jest.fn().mockImplementation(() => ({
            data: {},
            update: jest.fn(),
            destroy: jest.fn()
        })),
        {
            register: jest.fn()
        }
    );

    return {
        Chart: ChartMock,
        ArcElement: {},
        Tooltip: {},
        Legend: {},
        DoughnutController: {}
    };
});

import { ComponentFixture } from "@angular/core/testing";
import { ChapterDetailComponent } from "./chapter-detail.component";
import { Lesson } from "src/app/core/models/lesson.model";
import { UniqueResponses } from "src/app/core/models/uniqueResponses.model";
import { of } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatButtonModule } from "@angular/material/button";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from '../../../core/services/auth.service';
import { UserExerciseService } from "../../services/userExercise.service";
import { ChaptersService } from "../../services/chapters.service";
import { fakeAsync } from "@angular/core/testing";
import { tick } from "@angular/core/testing";
import { ArcElement, DoughnutController, Legend, Tooltip } from "chart.js";
import { Chart } from "chart.js";



describe('ChapterDetailComponent', () => {
    let component: ChapterDetailComponent;
    let fixture: ComponentFixture<ChapterDetailComponent>;

    const mockChapter = {
        id_chapter: 1,
        order: 3,
        title: 'Titre en gallo',
        title_fr: 'Titre en français',
        abstract: 'Lorem ipsum blblbllblblbl',
        isPublished: true,
        id_level: 1,
        Level: {
            title: 'A1'
        },
        Pages: [
            {
                id_page: 1,
                type: 'LESSON',
                order: 1,
                Lesson: {
                    title: 'Titre en gallo',
                    content: 'Lorem ipsum blblbllblblbl',
                }
            },
            {
                id_page: 2,
                type: 'EXERCISE',
                order: 2,
                Exercise: {
                    type: 'UNIQUE',
                    question: 'Question ?',
                    feedback: 'Correction',
                    UniqueResponses: [
                        {
                            id_response: 1,
                            response: 'Reponse 1',
                            is_correct: true
                        },
                        {
                            id_response: 2,
                            response: 'Reponse 2',
                            is_correct: false
                        }
                    ]
                }
            },
            {
                id_page: 3,
                type: 'EXERCISE',
                order: 3,
                Exercise: {
                    type: 'PAIRS',
                    question: 'Question ?',
                    feedback: 'Correction',
                    Pairs: [
                        {
                            id_response: 1,
                            content: 'Chat',
                            pair_key: 'a'
                        },
                        {
                            id_response: 2,
                            content: 'Cat',
                            pair_key: 'a'
                        }
                    ]
                }
            },
            {
                id_page: 4,
                type: 'EXERCISE',
                order: 4,
                Exercise: {
                    type: 'ORDER',
                    question: 'Question ?',
                    feedback: 'Correction',
                    PutInOrders: [
                        {
                            id_response: 1,
                            content: 'Chat',
                            correct_order: 1,
                            mixed_order: 2
                        },
                        {
                            id_response: 2,
                            content: 'Noir',
                            correct_order: 2,
                            mixed_order: 1
                        }
                    ]
                }
            }
        ]
    };

    const activatedRouteMock = {
        data: of({ chapter: mockChapter })
    };

    const authServiceMock= {
        isLogged: jest.fn()
    };

    const userExerciseServiceMock = {
        saveResult: jest.fn(() => of({})),
        getChapterScore: jest.fn(() => of({
            total: 2,
            correct: 2,
            percentage: 100
        }))
    };

    const chapterServiceMock = {
        startChapter: jest.fn(() => of({}))
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
                { provide: ChaptersService, useValue: chapterServiceMock }
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

    it('should identify content page', () => {
        component.pageIndex = 1;
        expect(
            component.isContentPage(mockChapter as any)
        ).toBeTruthy();
    });

    it('should return false for intro page', () => {
        component.pageIndex = 0;
        expect(
            component.isContentPage(mockChapter as any)
        ).toBeFalsy();    
    });

    it('should initialize chapter', (done) => {
        component.chapter$.subscribe((chapter) => {
            expect(chapter).toEqual(mockChapter);
            done();
        });
    });

    it('should return correct virtual length', () => {
        const result = component.getVirtualLength(mockChapter as any);
        expect(result).toBe(6);
    });

    it('should return pages', () => {
        const pages = component.getPages(mockChapter as any);
        expect(pages.length).toBe(4);
    });

    it('should go to next page', () => {
        component.pageIndex = 0;
        component.nextPage(mockChapter as any);
        expect(component.pageIndex).toBe(1);
    });

    it('should go to previous page', () => {
        component.pageIndex = 2;
        component.prevPage();
        expect(component.pageIndex).toBe(1);
    });

    it('should identify conclusion page', () => {
        component.pageIndex = 5;

        expect(
            component.isConclusion(mockChapter as any)
        ).toBeTruthy();
    });

    it('should start chapter if user is logged', () => {
        authServiceMock.isLogged.mockReturnValue(true);
        component.startChapter(1);
        expect(chapterServiceMock.startChapter).toHaveBeenCalledWith(1);
    });

    it('should not start chapter if user is not logged', () => {
        authServiceMock.isLogged.mockReturnValue(false);
        component.startChapter(1);
        expect(chapterServiceMock.startChapter).not.toHaveBeenCalled();
    });

    it('should validate unique answer without saving if user not logged', () => {
        authServiceMock.isLogged.mockReturnValue(false);
        const page = mockChapter.Pages[1];
        component.selectedAnswers[2] = 1;
        component.validateUnique(page as any);
        expect(component.isCorrect[2]).toBe(true);
        expect(userExerciseServiceMock.saveResult).not.toHaveBeenCalled();
    })

    it('should validate unique answer as correct', () => {
        authServiceMock.isLogged.mockReturnValue(true);
        const page = mockChapter.Pages[1];
        component.selectedAnswers[2] = 1;
        component.validateUnique(page as any);
        expect(component.isCorrect[2]).toBe(true);
        expect(userExerciseServiceMock.saveResult).toHaveBeenCalledWith(2, true);
    });

    it('should validate unique answer as incorrect', () => {
        authServiceMock.isLogged.mockReturnValue(true);
        const page = mockChapter.Pages[1];
        component.selectedAnswers[2] = 2;
        component.validateUnique(page as any);
        expect(component.isCorrect[2]).toBe(false);
        expect(userExerciseServiceMock.saveResult).toHaveBeenCalledWith(2, false);
    });

    it('should cache shuffled pairs', () => {
        const page = mockChapter.Pages[1];
        const first = component.getShuffledPairs(page as any);
        const second = component.getShuffledPairs(page as any);
        expect(first).toEqual(second);
    });

    it('should match pairs correctly', () => {
        authServiceMock.isLogged.mockReturnValue(true);

        const page = mockChapter.Pages[2];

        const pair1 = page.Exercise!.Pairs![0];
        const pair2 = page.Exercise!.Pairs![1];

        component.selectPairs(pair1 as any, page as any);
        component.selectPairs(pair2 as any, page as any);

        const state = component.getPairsState(3);

        expect(state.matchedIds.has(1)).toBe(true);
        expect(state.matchedIds.has(2)).toBe(true);

        expect(component.showFeedback[3]).toBe(true);
        expect(component.isCorrect[3]).toBe(true);

        expect(userExerciseServiceMock.saveResult)
            .toHaveBeenCalledWith(3, true);
    });

    it('should mark wrong pairs', fakeAsync(() => {
        const page = {
            id_page: 99,
            Exercise: {
                Pairs: [
                    {
                        id_response: 1,
                        pair_key: 'a'
                    },
                    {
                        id_response: 2,
                        pair_key: 'b'
                    }
                ]
            }
        };

        component.selectPairs(page.Exercise.Pairs[0] as any, page as any);
        component.selectPairs(page.Exercise.Pairs[1] as any, page as any);

        const state = component.getPairsState(99);

        expect(state.wrongIds.has(1)).toBe(true);
        expect(state.wrongIds.has(2)).toBe(true);

        tick(800);

        expect(state.wrongIds.size).toBe(0);
    }));

    it('should ignore already matched pairs', () => {
        const state = component.getPairsState(1);

        state.matchedIds.add(1);

        component.selectPairs(
            {
                id_response: 1,
                pair_key: 'a'
            } as any,
            {
                id_page: 1
            } as any
        );

        expect(state.currentSelection.length).toBe(0);
    });

     it('should cache order items', () => {
        const page = mockChapter.Pages[3];

        const first = component.getOrderItems(page as any);
        const second = component.getOrderItems(page as any);

        expect(first).toBe(second);
    });

    it('should reorder items on drop', () => {
        const page = mockChapter.Pages[3];

        const initial = component.getOrderItems(page as any);

        expect(initial[0].id_response).toBe(2);
        expect(initial[1].id_response).toBe(1);

        component.drop(
            {
                previousIndex: 0,
                currentIndex: 1
            } as any,
            page as any
        );

        const reordered = component.getOrderItems(page as any);

        expect(reordered[0].id_response).toBe(1);
        expect(reordered[1].id_response).toBe(2);
    });

    it('should validate correct order', () => {
        authServiceMock.isLogged.mockReturnValue(true);

        const page = mockChapter.Pages[3];

        component.orderCache[4] = [
            {
                id_response: 1
            },
            {
                id_response: 2
            }
        ] as any;

        component.validateOrder(page as any);

        expect(component.isCorrect[4]).toBe(true);

        expect(userExerciseServiceMock.saveResult)
            .toHaveBeenCalledWith(4, true);
    });

    it('should validate incorrect order', () => {
        authServiceMock.isLogged.mockReturnValue(true);

        const page = mockChapter.Pages[3];

        component.orderCache[4] = [
            {
                id_response: 2
            },
            {
                id_response: 1
            }
        ] as any;

        component.validateOrder(page as any);

        expect(component.isCorrect[4]).toBe(false);

        expect(userExerciseServiceMock.saveResult)
            .toHaveBeenCalledWith(4, false);
    });

    it('should extract youtube id', () => {
        const url = 'https://www.youtube.com/watch?v=1234567890';
        const id = component.getYoutubeId(url);
        expect(id).toBe('1234567890');
    });

    it('should return null for invalid youtube url', () => {
        const id = component.getYoutubeId('invalid-url');
        expect(id).toBeNull();
    });

    it('should create embed url', () => {
        const result = component.getEmbedUrl('https://www.youtube.com/watch?v=1234567890');
        expect(result).toBeTruthy();
    });

    it('should initialize pairs state', () => {
        const state = component.getPairsState(1);
        expect(state.currentSelection).toEqual([]);
        expect(state.matchedIds.size).toBe(0);
        expect(state.wrongIds.size).toBe(0);
    });

    it('should return current page', () => {
        component.pageIndex = 1;
        const page = component.getCurrentPage(mockChapter as any);
        expect(page?.id_page).toBe(1);
    });

    it('should not decrement page below 0', () => {
        component.pageIndex = 0;
        component.prevPage();
        expect(component.pageIndex).toBe(0);
    });

    it('should not increment beyond virtual length', () => {
        component.pageIndex = 5;
        component.nextPage(mockChapter as any);
        expect(component.pageIndex).toBe(5);
    });

     it('should create score chart', () => {
        component.score = 100;
        component.correctExercises = 5;
        component.totalExercises = 10;

        component.scoreChart = {
            nativeElement: document.createElement('canvas')
        } as any;

        component.updateScoreChart();

        expect(Chart).toHaveBeenCalled();
    });

    it('should not create score chart without values', () => {
        component.scoreChart = {
            nativeElement: document.createElement('canvas')
        } as any;

        component.updateScoreChart();

        expect(component.scoreChartInstance).toBeUndefined();
    });

    it('should update existing score chart', () => {
        const updateMock = jest.fn();

        component.score = 50;
        component.correctExercises = 1;
        component.totalExercises = 2;

        component.scoreChart = {
            nativeElement: document.createElement('canvas')
        } as any;

        component.scoreChartInstance = {
            data: {},
            update: updateMock
        } as any;

        component.updateScoreChart();

        expect(updateMock).toHaveBeenCalled();
    });

    it('should load score on conclusion page when logged', () => {
        authServiceMock.isLogged.mockReturnValue(true);
        component.pageIndex = 4;
        component.nextPage(mockChapter as any);
        expect(userExerciseServiceMock.getChapterScore).toHaveBeenCalledWith(1);
        expect(component.score).toBe(100);
        expect(component.correctExercises).toBe(2);
        expect(component.totalExercises).toBe(2);
    });

    it('should not fetch score if not logged', fakeAsync(() => {
        authServiceMock.isLogged.mockReturnValue(false);

        userExerciseServiceMock.getChapterScore.mockClear();

        component.pageIndex = 4;
        component.nextPage(mockChapter as any);

        expect(userExerciseServiceMock.getChapterScore).not.toHaveBeenCalled();
    }));

    it('should not fetch score if not on conclusion page', fakeAsync(() => {
        authServiceMock.isLogged.mockReturnValue(true);

        userExerciseServiceMock.getChapterScore.mockClear();

        component.pageIndex = 1; // pas conclusion
        component.nextPage(mockChapter as any);

        expect(userExerciseServiceMock.getChapterScore).not.toHaveBeenCalled();
    }));
});