import { AdminChapterExercisesService } from './admin-chapterExercises.service';
import { Page } from 'src/app/core/models/page.model';

describe('AdminExerciseService', () => {

  let service: AdminChapterExercisesService;

  beforeEach(() => {
    service = new AdminChapterExercisesService();
    jest.useRealTimers();
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
      expect(service.validateUnique(page)).toBe(true);
    });

    it('should return false for wrong answer', () => {
      service.selectedAnswers[1] = 1;
      expect(service.validateUnique(page)).toBe(false);
    });

    it('should return false if no answer selected', () => {
      service.selectedAnswers[1] = null;
      expect(service.validateUnique(page)).toBe(false);
    });

    it('should return false for non UNIQUE exercise', () => {
      const invalidPage = {
        id_page: 2,
        Exercise: { type: 'PAIRS' }
      } as any;

      expect(service.validateUnique(invalidPage)).toBe(false);
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

    it('should store first selection', () => {
      service.selectPair(pairsPage.Exercise!.Pairs![0], pairsPage);
      const state = service.getPairsState(1);
      expect(state.currentSelection.length).toBe(1);
    });

    it('should match correct pair', () => {
      const [a, b] = pairsPage.Exercise!.Pairs!;
      service.selectPair(a, pairsPage);
      const completed = service.selectPair(b, pairsPage);
      const state = service.getPairsState(1);
      expect(state.matchedIds.has(1)).toBe(true);
      expect(state.matchedIds.has(2)).toBe(true);
      expect(completed).toBe(false);
    });

    it('should complete when all pairs matched', () => {
      const p = pairsPage.Exercise!.Pairs!;
      service.selectPair(p[0], pairsPage);
      service.selectPair(p[1], pairsPage);
      service.selectPair(p[2], pairsPage);
      const completed = service.selectPair(p[3], pairsPage);
      expect(completed).toBe(true);
    });

    it('should ignore already matched item', () => {
      const [a, b] = pairsPage.Exercise!.Pairs!;
      service.selectPair(a, pairsPage);
      service.selectPair(b, pairsPage);
      const result = service.selectPair(a, pairsPage);
      expect(result).toBe(false);
    });

    it('should handle wrong pair and cleanup after timeout', () => {
      jest.useFakeTimers();
      const [a, , b] = pairsPage.Exercise!.Pairs!;
      service.selectPair(a, pairsPage);
      service.selectPair(b, pairsPage);
      const state = service.getPairsState(1);
      expect(state.wrongIds.size).toBeGreaterThan(0);
      jest.advanceTimersByTime(800);
      expect(state.wrongIds.size).toBe(0);
      jest.useRealTimers();
    });

    it('should return shuffled list (cached)', () => {
      const first = service.getShuffledPairs(pairsPage);
      const second = service.getShuffledPairs(pairsPage);
      expect(first).toBe(second);
    });

    it('should return empty array when Pairs is undefined', () => {
        const pageWithoutPairs = {
            id_page: 99,
            Exercise: {
            type: 'PAIRS'
            }
        } as any as Page;
        const result = service.getShuffledPairs(pageWithoutPairs);
        expect(result).toEqual([]);
    });

    it('should shuffle and cache pairs when first call', () => {
        const result1 = service.getShuffledPairs(pairsPage);
        const result2 = service.getShuffledPairs(pairsPage);

        expect(result1).toEqual(result2);
    });

    it('should return false when Pairs is undefined', () => {
    const pageWithoutPairs = {
        id_page: 1,
        Exercise: { type: 'PAIRS' }
    } as any as Page;

    expect(service.isPairsComplete(pageWithoutPairs)).toBe(false);
    });

    it('should return false when Pairs is empty', () => {
    const pageEmpty = {
        id_page: 1,
        Exercise: { type: 'PAIRS', Pairs: [] }
    } as any as Page;

    expect(service.isPairsComplete(pageEmpty)).toBe(false);
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

    it('should not handle empty order list', () => {
      const empty = {
        id_page: 99,
        Exercise: { PutInOrders: [] }
      } as any;
      expect(service.validateOrder(empty)).toBe(false);
    });

    it('should return false when no pairs exist but state is not empty', () => {
        const page = {
            id_page: 1,
            Exercise: {
            type: 'PAIRS'
            }
        } as any as Page;

        const state = service.getPairsState(1);
        state.matchedIds.add(999);

        expect(service.isPairsComplete(page)).toBe(false);
    });

    it('should return empty array when PutInOrders is undefined', () => {
        const page = {
            id_page: 99,
            Exercise: {
            type: 'ORDER'
            }
        } as any as Page;

        const result = service.getOrderItems(page);

        expect(result).toEqual([]);
    });

    it('should sort PutInOrders by mixed_order', () => {
        const page = {
            id_page: 1,
            Exercise: {
            type: 'ORDER',
            PutInOrders: [
                { id_response: 1, mixed_order: 3, correct_order: 1 },
                { id_response: 2, mixed_order: 1, correct_order: 2 }
            ]
            }
        } as any as Page;

        const result = service.getOrderItems(page);

        expect(result.map(i => i.id_response)).toEqual([2, 1]);
    });

    it('should use cache on second call', () => {
        const page = {
            id_page: 1,
            Exercise: {
            type: 'ORDER',
            PutInOrders: [
                { id_response: 1, mixed_order: 2, correct_order: 1 },
                { id_response: 2, mixed_order: 1, correct_order: 2 }
            ]
            }
        } as any as Page;

        const first = service.getOrderItems(page);
        const second = service.getOrderItems(page);

        expect(first).toEqual(second);
    });

    it('should move item in list correctly', () => {
        const page = {
            id_page: 1,
            Exercise: {
            type: 'ORDER',
            PutInOrders: [
                { id_response: 1, mixed_order: 1, correct_order: 1 },
                { id_response: 2, mixed_order: 2, correct_order: 2 }
            ]
            }
        } as any as Page;

        service.getOrderItems(page); // init cache

        service.moveOrderItem(page, 0, 1);

        const result = service.getOrderItems(page);

        expect(result.map(i => i.id_response)).toEqual([2, 1]);
    });

    it('should return false when PutInOrders is undefined', () => {
        const page = {
            id_page: 1,
            Exercise: {
            type: 'ORDER'
            }
        } as any as Page;

        expect(service.validateOrder(page)).toBe(false);
    });

  });
});