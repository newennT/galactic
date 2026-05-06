import { TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AdminExerciseFormService } from './admin-exercise-form.service';

describe('AdminExerciseFormService', () => {

    let service: AdminExerciseFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FormBuilder, AdminExerciseFormService]
        });
        service = TestBed.inject(AdminExerciseFormService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

  

//   createExerciseGroup

    it('should create exercise with default values when empty', () => {
        const form = service.createExerciseGroup({});
        expect(form.value.question).toBe('');
        expect(form.value.type).toBe('UNIQUE');
        expect(form.value.uniqueResponses.length).toBe(2);
    });

        // UniqueResponses

    it('should add unique response', () => {
        const fa = new FormBuilder().array([]);
        service.addUniqueResponse(fa);
        expect(fa.length).toBe(1);
    });

    it('should remove unique response when allowed', () => {
        const fb = new FormBuilder();
        const fa = fb.array([
            fb.group({ is_correct: false }),
            fb.group({ is_correct: false }),
            fb.group({ is_correct: true })
        ]);
        service.removeUniqueResponse(fa, 0);
        expect(fa.length).toBe(2);
    });

    it('should NOT remove last wrong response', () => {
        const fb = new FormBuilder();
        const fa = fb.array([
            fb.group({ is_correct: false }),
            fb.group({ is_correct: true })
        ]);
        service.removeUniqueResponse(fa, 0);
        expect(fa.length).toBe(2);
    });

    it('should handle correct + wrong responses', () => {
        const exercise = {
        UniqueResponses: [
            { id_response: 1, content: 'good', is_correct: true },
            { id_response: 2, content: 'bad', is_correct: false }
        ]
        };
        const form = service.createExerciseGroup(exercise);
        expect(form.value.uniqueResponses.length).toBe(2);
        expect(form.value.uniqueResponses[0].is_correct).toBe(true);
        expect(form.value.uniqueResponses[1].is_correct).toBe(false);
    });

    it('should handle missing correct response', () => {
        const exercise = {
        UniqueResponses: [
            { id_response: 2, content: 'bad', is_correct: false }
        ]
        };
        const form = service.createExerciseGroup(exercise);
        const correct = form.value.uniqueResponses.find((r: any) => r.is_correct);
        expect(correct.content).toBe('');
    });

    it('should create default unique responses when none exist', () => {
        const exercise = {
            UniqueResponses: []
        };
        const form = service.createExerciseGroup(exercise);
        const responses = form.value.uniqueResponses;
        expect(responses.length).toBe(2);
        expect(responses[0].is_correct).toBe(true);
        expect(responses[1].is_correct).toBe(false);
    });

    it('should create default unique responses when UniqueResponses is undefined', () => {
        const form = service.createExerciseGroup({});
        const responses = form.value.uniqueResponses;
        expect(responses.length).toBe(2);
    });

    it('should create default wrong response when none exists', () => {
        const exercise = {
            UniqueResponses: [
            {
                id_response: 1,
                content: 'correct answer',
                is_correct: true
            }
            ]
        };
        const form = service.createExerciseGroup(exercise);
        const responses = form.value.uniqueResponses;
        expect(responses.length).toBe(2);
        expect(responses[0].is_correct).toBe(true);
        expect(responses[1].is_correct).toBe(false);
        expect(responses[1].content).toBe('');
    });

    

  
    // Pairs 

    it('should group pairs by key', () => {
        const pairs = [
            { pair_key: '1', content: 'A' },
            { pair_key: '1', content: 'B' }
        ];
        const result = service.mapPairsByKey(pairs as any);
        expect(result.length).toBe(1);
        expect(result[0].content_left).toBe('A');
        expect(result[0].content_right).toBe('B');
    });

    it('should add pair', () => {
        const fb = new FormBuilder();
        const fa = fb.array<FormGroup>([]);
        service.addPair(fa);
        expect(fa.length).toBe(1);
        const control = fa.at(0) as FormGroup;
        expect(control.value.content_left).toBe('');
    });

    it('should remove pair', () => {
        const fb = new FormBuilder();
        const fa = fb.array([fb.group({})]);
        service.removePair(fa, 0);
        expect(fa.length).toBe(0);
    });

    it('should map pairs into FormArray', () => {
        const exercise = {
            Pairs: [
            { pair_key: '1', content: 'A' },
            { pair_key: '1', content: 'B' }
            ]
        };
        const form = service.createExerciseGroup(exercise);
        const pairs = form.value.pairs;
        expect(pairs.length).toBe(1);
        expect(pairs[0].content_left).toBe('A');
        expect(pairs[0].content_right).toBe('B');
    });

    it('should handle empty pairs array', () => {
        const form = service.createExerciseGroup({});
        expect(form.value.pairs.length).toBe(0);
    });

 




    // Order 

    it('should normalize ORDER exercise', () => {
        const formValue: any = {
        pages: [
            {
            type: 'EXERCISE',
            exercise: {
                type: 'ORDER',
                orderText: 'A;B;C'
            }
            }
        ]
        };
        const result = service.normalizeOrderExercises(formValue);
        expect(result.pages[0].exercise.putInOrders.length).toBe(3);
    });

    it('should build ORDER exercise text', () => {
        const exercise = {
        type: 'ORDER',
        PutInOrders: [
            { content: 'B', correct_order: 2 },
            { content: 'A', correct_order: 1 }
        ]
        };
        const form = service.createExerciseGroup(exercise);
        expect(form.value.orderText).toBe('A;B');
    });




    it('should get orderText control', () => {
        const fb = new FormBuilder();
        const form = fb.group({
            exercise: fb.group({
                orderText: ['test']
            })
        });
        const control = service.getOrderTextControl(form);
        expect(control.value).toBe('test');
    });


    // Medias 

    it('should nullify media when no url', () => {
        const formValue: any = {
        pages: [
            {
            type: 'EXERCISE',
            exercise: {
                media_url: '',
                media_type: 'img'
            }
            }
        ]
        };
        const result = service.normalizeOrderExercises(formValue);
        expect(result.pages[0].exercise.media_url).toBeNull();
        expect(result.pages[0].exercise.media_type).toBeNull();
    });

    it('should keep media values when media_url exists', () => {
    const formValue: any = {
        pages: [
        {
            type: 'EXERCISE',
            exercise: {
            type: 'UNIQUE',
            media_url: 'image.png',
            media_type: 'IMAGE'
            }
        }
        ]
    };
    const result = service.normalizeOrderExercises(formValue);
    expect(result.pages[0].exercise.media_url).toBe('image.png');
    expect(result.pages[0].exercise.media_type).toBe('IMAGE');
    });

});