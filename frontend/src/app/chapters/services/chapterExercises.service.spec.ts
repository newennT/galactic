import { ChapterExercisesService } from './chapterExercises.service';
import { Page } from 'src/app/core/models/page.model';

describe('ExerciseService', () => {

  let service: ChapterExercisesService;

  beforeEach(() => {
    service = new ChapterExercisesService();
  });

  describe('ChapterExercisesService', () => {

    // UniqueResponses

    const page = {
      id_page: 1,
      Exercise: {
        type: 'UNIQUE',
        UniqueResponses: [
          {
            id_response: 1,
            is_correct: false
          },
          {
            id_response: 2,
            is_correct: true
          }
        ]
      }
    } as unknown as Page;

    it('should return true for correct answer', () => {

      service.selectedAnswers[1] = 2;

      expect(service.validateUnique(page))
        .toBe(true);
    });

    it('should return false for wrong answer', () => {

      service.selectedAnswers[1] = 1;

      expect(service.validateUnique(page))
        .toBe(false);
    });

    it('should return false if no answer selected', () => {

      service.selectedAnswers[1] = null;

      expect(service.validateUnique(page))
        .toBe(false);
    });


    // Pairs

    const pairsPage = {
        id_page: 1,
        Exercise: {
            Pairs: [
            {
                id_response: 1,
                pair_key: 'A'
            },
            {
                id_response: 2,
                pair_key: 'A'
            },
            {
                id_response: 3,
                pair_key: 'B'
            },
            {
                id_response: 4,
                pair_key: 'B'
            }
            ]
        }
    } as unknown as Page;

    it('should store first selected pair', () => {

        const item =
            pairsPage.Exercise!.Pairs![0];

        service.selectPair(item, pairsPage);

        const state =
            service.getPairsState(1);

        expect(state.currentSelection.length)
            .toBe(1);
    });

    it('should match correct pair', () => {

        const a =
            pairsPage.Exercise!.Pairs![0];

        const b =
            pairsPage.Exercise!.Pairs![1];

        service.selectPair(a, pairsPage);

        const completed =
            service.selectPair(b, pairsPage);

        const state =
            service.getPairsState(1);

        expect(state.matchedIds.has(1)).toBe(true);

        expect(state.matchedIds.has(2)).toBe(true);

        expect(completed).toBe(false);
    });

    it('should complete exercise when all pairs matched', () => {

        const pairs =
            pairsPage.Exercise!.Pairs;

        service.selectPair(pairs![0], pairsPage);
        service.selectPair(pairs![1], pairsPage);

        service.selectPair(pairs![2], pairsPage);

        const completed =
            service.selectPair(pairs![3], pairsPage);

        expect(completed)
            .toBe(true);
    });

    it('should remove wrong pair after timeout', () => {

        jest.useFakeTimers();

        const a =
            pairsPage.Exercise!.Pairs![0];

        const b =
            pairsPage.Exercise!.Pairs![2];

        service.selectPair(a, pairsPage);
        service.selectPair(b, pairsPage);

        const state =
            service.getPairsState(1);

        expect(state.wrongIds.has(1))
            .toBe(true);

        jest.advanceTimersByTime(800);

        expect(state.wrongIds.has(1))
            .toBe(false);

        jest.useRealTimers();
    });


    // ORDER 

    const orderPage = {
        id_page: 2,
        Exercise: {
            PutInOrders: [
            {
                id_response: 1,
                mixed_order: 2,
                correct_order: 1
            },
            {
                id_response: 2,
                mixed_order: 1,
                correct_order: 2
            }
            ]
        }
    } as unknown as Page;

    it('should return items sorted by mixed_order', () => {
        const result = service.getOrderItems(orderPage);
        expect(result[0].id_response).toBe(2);
        expect(result[1].id_response).toBe(1);
    });

    it('should move item in order list', () => {
        service.moveOrderItem(orderPage, 0, 1);
        const result = service.getOrderItems(orderPage);
        expect(result[0].id_response) .toBe(1);
    });

    it('should validate correct order', () => {
        service.moveOrderItem(orderPage, 0, 1);
        const result = service.validateOrder(orderPage);
        expect(result).toBe(true);
    });

    it('should return false for incorrect order', () => {
        const result = service.validateOrder(orderPage);
        expect(result).toBe(false);
    });

  });
});