import { Injectable } from '@angular/core';
import { Page } from 'src/app/core/models/page.model';
import { Pairs } from 'src/app/core/models/pairs.model';
import { PutInOrders } from 'src/app/core/models/putInOrders.model';
import { UniqueResponses } from 'src/app/core/models/uniqueResponses.model';

interface PairState {
  currentSelection: Pairs[];
  matchedIds: Set<number>;
  wrongIds: Set<number>;
}

@Injectable({
    providedIn: 'root'
})
export class ChapterExercisesService {


  // UNIQUE
  selectedAnswers: Record<number, number | null> = {};
  validateUnique(page: Page): boolean {
    if (
        !page.Exercise ||
        page.Exercise.type !== 'UNIQUE'
        ) {
        return false;
    }

    const selectedId =
        this.selectedAnswers[page.id_page];

    const selectedResponse =
        page.Exercise.UniqueResponses?.find(
            (response: UniqueResponses) =>
            response.id_response === selectedId
        );

        return selectedResponse?.is_correct ?? false;
    }

  // ---------------- PAIRS

    pairsCache: Record<number, Pairs[]> = {};
    pairsState: {
        [pageId: number]: {
            currentSelection: Pairs[],
            matchedIds: Set<number>,
            wrongIds: Set<number>
        }
    } = {};

    getPairsState(pageId: number): PairState {
        if (!this.pairsState[pageId]) {
            this.pairsState[pageId] = {
                currentSelection: [],
                matchedIds: new Set(),
                wrongIds: new Set()
            };
        }
        return this.pairsState[pageId];
    }

    getShuffledPairs(page: Page): Pairs[] {
        const pageId = page.id_page;

        if (!this.pairsCache[pageId]) {
            this.pairsCache[pageId] = [
                ...(page.Exercise?.Pairs ?? [])
            ].sort(() => Math.random() - 0.5);
        }

        return this.pairsCache[pageId];
    }

    selectPair(item: Pairs, page: Page): boolean {
        const state = this.getPairsState(page.id_page);

        if (state.matchedIds.has(item.id_response)) {
            return false;
        }

        state.currentSelection.push(item);

        if (state.currentSelection.length < 2) {
            return false;
        }

        const [a, b] = state.currentSelection;

        if (a.pair_key === b.pair_key) {
            state.matchedIds.add(a.id_response);
            state.matchedIds.add(b.id_response);
        } else {
            state.wrongIds.add(a.id_response);
            state.wrongIds.add(b.id_response);

            setTimeout(() => {
                state.wrongIds.delete(a.id_response);
                state.wrongIds.delete(b.id_response);
            }, 800);
        }

        state.currentSelection = [];

        return this.isPairsComplete(page);
    }

    isPairsComplete(page: Page): boolean {
        const state = this.getPairsState(page.id_page);
        const total = page.Exercise?.Pairs?.length ?? 0;

        if(!total){
            return false;
        }

        return state.matchedIds.size === total;
    }

  // ---------------- ORDER

  private orderCache: Record<number, PutInOrders[]> = {};

    getOrderItems(page: Page): PutInOrders[] {
        const pageId = page.id_page;
        if (!this.orderCache[pageId]) {
            this.orderCache[pageId] = [
                ...(page.Exercise?.PutInOrders ?? [])
            ].sort((a, b) => a.mixed_order - b.mixed_order);
        }
        return this.orderCache[pageId];
    }

    moveOrderItem(
        page: Page,
        previousIndex: number,
        currentIndex: number
    ) {
        const list = this.getOrderItems(page);
        const item = list.splice(previousIndex, 1)[0];
        list.splice(currentIndex, 0, item);
    }

    // validateOrder(page: Page): boolean {
    //     const current = this.getOrderItems(page).map(i => i.id_response);
    //     const correct = [...(page.Exercise?.PutInOrders ?? [])]
    //     .sort((a, b) => a.correct_order - b.correct_order)
    //     .map(i => i.id_response);
    //     return JSON.stringify(current) === JSON.stringify(correct);
    // }

    validateOrder(page: Page): boolean {
        const items = page.Exercise?.PutInOrders;
        
        if (!items || items.length === 0) {
            return false;
        }
        const current = this.getOrderItems(page).map(i => i.id_response);
        const correct = [...items]
            .sort((a, b) => a.correct_order - b.correct_order)
            .map(i => i.id_response);

        return JSON.stringify(current) === JSON.stringify(correct);
    }

}