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
import { CompileIdentifierMetadata } from "@angular/compiler";



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
                            content: 'Reponse 1',
                            is_correct: true
                        },
                        {
                            id_response: 2,
                            content: 'Reponse 2',
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


    // Identifier les pages de contenu

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

    it('should display intro page content', () => {
        component.pageIndex = 0;

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;

        expect(compiled.querySelector('h1')?.textContent)
            .toContain('Titre en gallo');

        expect(compiled.querySelector('#btn-start'))
            .toBeTruthy();
    });

    it('should display lesson title and content', () => {
        component.pageIndex = 1;

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;

        expect(compiled.querySelector('.lesson-title')?.textContent)
            .toContain('Titre en gallo');

        expect(compiled.querySelector('.lesson-content')?.textContent)
            .toContain('Lorem ipsum blblbllblblbl');
    });

    it('should initialize chapter', (done) => {
        component.chapter$.subscribe((chapter) => {
            expect(chapter).toEqual(mockChapter);
            done();
        });
    });

    it('should return pages when chapter has pages', () => {
        const result = component.getPages(mockChapter as any);
        expect(result.length).toBe(4);
    });

    it('should return empty array when chapter has no pages', () => {
        const chapterWithoutPages = {
            ...mockChapter,
            Pages: undefined
        };
        const result = component.getPages(chapterWithoutPages as any);
        expect(result).toEqual([]);
    });

    it('should compute virtual length with pages', () => {
        const result = component.getVirtualLength(mockChapter as any);
        expect(result).toBe(mockChapter.Pages.length + 2);
    });

    it('should compute virtual length with empty pages', () => {
        const chapterWithoutPages = {
            ...mockChapter,
            Pages: undefined
        };
        const result = component.getVirtualLength(chapterWithoutPages as any);
        expect(result).toBe(2);
    });



    // Navigation par page

    it('should go to next page on lesson button click', () => {
        component.pageIndex = 1;
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('#btn-lesson-next');
        button.click();
        fixture.detectChanges();
        expect(component.pageIndex).toBe(2);
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


    // Enregistrer le début d'un chapitre

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


    // Exercise UniqueResponses

    it('should display unique exercise responses', () => {
        component.pageIndex = 2;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const responses = compiled.querySelectorAll('.unique-response-item');
        expect(responses.length).toBe(2);
        expect(compiled.textContent).toContain('Reponse 1');
        expect(compiled.textContent).toContain('Reponse 2');
    });

    it('should disable validate button if no answer selected', () => {
        component.pageIndex = 2;
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('.btn-validate');
        expect(button.disabled).toBe(true);
    });

    it('should enable validate button when answer selected', async () => {
        component.pageIndex = 2;
        fixture.detectChanges();
        component.selectedAnswers[2] = 1;
        fixture.detectChanges();
        await fixture.whenStable();
        const button = fixture.nativeElement.querySelector('.btn-validate');
        expect(button.disabled).toBe(false);
    })

    it('should validate unique answer without saving if user not logged', () => {
        authServiceMock.isLogged.mockReturnValue(false);
        const page = mockChapter.Pages[1];
        component.selectedAnswers[2] = 1;
        component.validateUnique(page as any);
        expect(component.isCorrect[2]).toBe(true);
        expect(userExerciseServiceMock.saveResult).not.toHaveBeenCalled();
    });

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

    it('should ignore validateUnique if page has no exercise', () => {
        component.validateUnique({} as any);
        expect(userExerciseServiceMock.saveResult)
            .not.toHaveBeenCalled();
    });

    it('should set isCorrect to false when response is not found', () => {
        authServiceMock.isLogged.mockReturnValue(true);
        const page = mockChapter.Pages[1];
        component.selectedAnswers[2] = 999; // id inexistant
        component.validateUnique(page as any);
        expect(component.isCorrect[2]).toBe(false);
    });

    it('should set isCorrect to false when response is incorrect', () => {
        authServiceMock.isLogged.mockReturnValue(true);
        const page = mockChapter.Pages[1];
        component.selectedAnswers[2] = 2; // réponse incorrecte
        component.validateUnique(page as any);
        expect(component.isCorrect[2]).toBe(false);
    });

    it('should set isCorrect to true when response is correct', () => {
        authServiceMock.isLogged.mockReturnValue(true);
        const page = mockChapter.Pages[1];
        component.selectedAnswers[2] = 1; // réponse correcte
        component.validateUnique(page as any);
        expect(component.isCorrect[2]).toBe(true);
    });


    it('should display correct feedback', () => {
        component.pageIndex = 2;
        component.showFeedback[2] = true;
        component.isCorrect[2] = true;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.feedback')?.textContent)
            .toContain('Réponse correcte');
    });

    it('should display incorrect feedback', () => {
        component.pageIndex = 2;
        component.showFeedback[2] = true;
        component.isCorrect[2] = false;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Correction');
        expect(compiled.textContent).toContain('Réponse incorrecte');
    });


    // Exercise Pairs

    it('should display pairs exercise', () => { 
        component.pageIndex = 3;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const items = compiled.querySelectorAll('.pairs-list li');
        expect(items.length).toBe(2);
        const text = compiled.textContent?.replace(/\s/g, '').trim();
        expect(text).toContain('Chat');
        expect(text).toContain('Cat');
    });

    it('should fallback total to 0 when no pairs exist', () => {
        const page = {
            id_page: 10,
            Exercise: {
                Pairs: undefined
            }
        } as any;
        const state = component.getPairsState(10);
        state.matchedIds.add(1);
        state.matchedIds.add(2);
        component.checkPairsCompleted(page);
        expect(component.showFeedback[10]).toBeUndefined();
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

    it('should highlight selected pair item', () => {
        component.pageIndex = 3;
        fixture.detectChanges();
        const page = mockChapter.Pages[2];
        const pair = page.Exercise!.Pairs![0];
        component.selectPairs(pair as any, page as any);
        fixture.detectChanges();
        const selected = fixture.nativeElement.querySelector('.selected');
        expect(selected).toBeTruthy();
    });

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

    it('should initialize pairs state', () => {
        const state = component.getPairsState(1);
        expect(state.currentSelection).toEqual([]);
        expect(state.matchedIds.size).toBe(0);
        expect(state.wrongIds.size).toBe(0);
    });

    it('should display pairs success feedback', () => {
        component.pageIndex = 3;
        component.showFeedback[3] = true;
        component.isCorrect[3] = true;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.feedback')?.textContent)
            .toContain('Exercice réussi');
    });

    it('should go to next page from pairs exercise', () => {        
        component.pageIndex = 3;
        component.showFeedback[3] = true;
        component.isCorrect[3] = true;
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('.btn-ex-next');
        button.click();
        fixture.detectChanges();
        expect(component.pageIndex).toBe(4);
    });

    it('should navigate back from pairs exercise', () => {
        component.pageIndex = 3;
        component.showFeedback[3] = true;
        fixture.detectChanges();
        const backLink = fixture.nativeElement.querySelector('.buttons a');
        backLink.click();
        fixture.detectChanges();
        expect(component.pageIndex).toBe(2);
    });



    // Exercise Order

    it('should display order exercise items', () => {
        component.pageIndex = 4;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const items = compiled.querySelectorAll('.order-item');
        expect(items.length).toBe(2);
        const text = compiled.textContent?.replace(/\s+/g, ' ').trim();
        expect(text).toContain('Chat');
        expect(text).toContain('Noir');
    });

     it('should cache order items', () => {
        const page = mockChapter.Pages[3];
        const first = component.getOrderItems(page as any);
        const second = component.getOrderItems(page as any);
        expect(first).toBe(second);
    });

    it('should fallback to empty array and cache sorted order items', () => {
        const page = {
            id_page: 20,
            Exercise: {
                PutInOrders: undefined
            }
        } as any;
        const result = component.getOrderItems(page);
        expect(result).toEqual([]);
        expect(component.orderCache[20]).toEqual([]);
    });

    it('should validate order using fallback empty array', () => {
        const page = {
            id_page: 23,
            Exercise: {
                PutInOrders: undefined
            }
        } as any;
        component.validateOrder(page);
        expect(component.isCorrect[23]).toBe(true); 
        expect(component.showFeedback[23]).toBe(true);
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

    it('should reorder list when drop is triggered', () => {
        const page = {
            id_page: 22,
            Exercise: {
                PutInOrders: [
                    { id_response: 1, mixed_order: 1 },
                    { id_response: 2, mixed_order: 2 }
                ]
            }
        } as any;
        component.getOrderItems(page); // init cache
        component.drop(
            {
                previousIndex: 0,
                currentIndex: 1
            } as any,
            page
        );
        const result = component.getOrderItems(page);
        expect(result[0].id_response).toBe(2);
        expect(result[1].id_response).toBe(1);
    });

    it('should sort order items by mixed_order', () => {
        const page = {
            id_page: 21,
            Exercise: {
                PutInOrders: [
                    { id_response: 1, mixed_order: 2 },
                    { id_response: 2, mixed_order: 1 }
                ]
            }
        } as any;
        const result = component.getOrderItems(page);
        expect(result.map(i => i.id_response)).toEqual([2, 1]);
    });

    it('should display validate button for order exercise', () => {
        component.pageIndex = 4;
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('.btn-ex-next');
        expect(button).toBeTruthy();
        expect(button.textContent)
            .toContain('Valider');
    });

    it('should hide validate button after order validation', () => {
        component.pageIndex = 4;
        component.showFeedback[4] = true;
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('.btn-validate');
        expect(button).toBeFalsy();
    });

    it('should validate correct order', () => {
        const page = {
            id_page: 24,
            Exercise: {
                PutInOrders: [
                    { id_response: 1, correct_order: 1 },
                    { id_response: 2, correct_order: 2 }
                ]
            }
        } as any;

        component.orderCache[24] = [
            { id_response: 1 },
            { id_response: 2 }
        ] as any;

        component.validateOrder(page);

        expect(component.isCorrect[24]).toBe(true);
    });

    it('should validate incorrect order', () => {
        const page = {
            id_page: 25,
            Exercise: {
                PutInOrders: [
                    { id_response: 1, correct_order: 1 },
                    { id_response: 2, correct_order: 2 }
                ]
            }
        } as any;

        component.orderCache[25] = [
            { id_response: 2 },
            { id_response: 1 }
        ] as any;

        component.validateOrder(page);

        expect(component.isCorrect[25]).toBe(false);
    });

    it('should display correct order feedback', () => {
        component.pageIndex = 4;
        component.showFeedback[4] = true;
        component.isCorrect[4] = true;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const text = compiled.textContent?.replace(/\s+/g, ' ').trim();
        expect(text).toContain('Réponse correcte');
    });

    it('should display incorrect order feedback', () => {
        component.pageIndex = 4;
        component.showFeedback[4] = true;
        component.isCorrect[4] = false;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const text = compiled.textContent?.replace(/\s+/g, ' ').trim();
        expect(text).toContain('Réponse incorrecte');
        expect(text).toContain('Correction');
    });

    it('should navigate to next page from order exercise', () => {
        component.pageIndex = 4;
        component.showFeedback[4] = true;
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('.btn-ex-next');
        button.click();
        fixture.detectChanges();
        expect(component.pageIndex).toBe(5);
    });

    it('should navigate back from order exercise', () => {
        component.pageIndex = 4;
        component.showFeedback[4] = true;
        fixture.detectChanges();
        const backLink = fixture.nativeElement.querySelector('.buttons a');
        backLink.click();
        fixture.detectChanges();
        expect(component.pageIndex).toBe(3);
    });



    // Traitement vidéo

    it('should extract youtube id', () => {
        const url = 'https://www.youtube.com/watch?v=1234567890';
        const id = component.getYoutubeId(url);
        expect(id).toBe('1234567890');
    });

    it('should return null for invalid youtube url', () => {
        const id = component.getYoutubeId('invalid-url');
        expect(id).toBeNull();
    });

    it('should return null for empty url', () => {    
        const id = component.getYoutubeId('');
        expect(id).toBeNull();
    });

    it('should create embed url', () => {
        const result = component.getEmbedUrl('https://www.youtube.com/watch?v=1234567890');
        expect(result).toBeTruthy();
    });

    it('should generate embed url even with invalid url', () => {
        const result = component.getEmbedUrl('invalid-url');
        expect(result).toBeTruthy();
    });



    // Affichage du graphique

    it('should display conclusion page', () => {
        component.pageIndex = 5;
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Bravo, chapitre terminé');
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

    it('should not create chart if values are missing', () => {
        component.scoreChart = {
            nativeElement: document.createElement('canvas')
        } as any;
        component.score = 100;
        component.correctExercises = undefined;
        component.totalExercises = 10;
        component.updateScoreChart();
        expect(Chart).not.toHaveBeenCalled();
    });

    it('should create chart when all values are present', () => {
        component.scoreChart = {
            nativeElement: document.createElement('canvas')
        } as any;

        component.score = 100;
        component.correctExercises = 5;
        component.totalExercises = 10;

        component.updateScoreChart();

        expect(Chart).toHaveBeenCalled();
    });

    it('should not update chart without canvas', () => {
        component.score = 100;
        component.correctExercises = 3;
        component.totalExercises = 3;
        component.updateScoreChart();
        expect(component.scoreChartInstance).toBeUndefined();
    });

    it('should update existing score chart', () => {
        const updateMock = jest.fn();

        component.score = 0;
        component.correctExercises = 0;
        component.totalExercises = 3;

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

    it('should call updateScoreChart after loading score', fakeAsync(() => {
        authServiceMock.isLogged.mockReturnValue(true);
        const spy = jest.spyOn(component, 'updateScoreChart');
        component.pageIndex = 4;
        component.scoreChart = {
            nativeElement: document.createElement('canvas')
        } as any;
        component.nextPage(mockChapter as any);
        tick();
        expect(spy).toHaveBeenCalled();
    }));

    it('should display score values on conclusion page', () => {
        component.pageIndex = 5;
        component.score = 100;
        component.correctExercises = 3;
        component.totalExercises = 3;

        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const text = compiled.textContent?.replace(/\s+/g, ' ').trim();
        expect(text).toContain('100 %');
    });

    it('should not fetch score if not on conclusion page', fakeAsync(() => {
        authServiceMock.isLogged.mockReturnValue(true);

        userExerciseServiceMock.getChapterScore.mockClear();

        component.pageIndex = 1;
        component.nextPage(mockChapter as any);

        expect(userExerciseServiceMock.getChapterScore).not.toHaveBeenCalled();
    }));

    it('should display dashboard button if user logged', () => {
        authServiceMock.isLogged.mockReturnValue(true);
        component.pageIndex = 5;
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('button[routerLink="/dashboard"]');
        expect(button).toBeTruthy();
    });

    it('should not display dashboard button if user not logged', () => {
        authServiceMock.isLogged.mockReturnValue(false);
        component.pageIndex = 5;
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('button[routerLink="/dashboard"]');
        expect(button).toBeFalsy();
    });
    
});