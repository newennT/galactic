import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Chapter } from 'src/app/core/models/chapter.model';
import { map } from 'rxjs/operators';
import { Page } from 'src/app/core/models/page.model';
import { UniqueResponses } from 'src/app/core/models/uniqueResponses.model';
import { Pairs } from 'src/app/core/models/pairs.model';
import { PutInOrders } from 'src/app/core/models/putInOrders.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-admin-chapter-view',
  templateUrl: './admin-chapter-view.component.html',
  styleUrls: ['./admin-chapter-view.component.scss']
})
export class AdminChapterViewComponent implements OnInit{

  constructor(private route: ActivatedRoute){}

  // Récupérer le chapter
  adminChapter$: Observable<Chapter> = this.route.data.pipe(
    map(data => data['adminChapter'])
  )


  // Pagination du chapter
  pageIndex = 0;

  getVirtualLength(chapter: Chapter): number {
    const pages = chapter.Pages ?? [];
    return pages.length + 2;
  }

  getPages(chapter: Chapter) {
    return chapter.Pages ?? [];
  }

  getCurrentPage(chapter: Chapter) {
    return chapter.Pages?.[this.pageIndex - 1];
  }

  nextPage(chapter: Chapter){
    if(this.pageIndex < this.getVirtualLength(chapter) - 1){
      this.pageIndex++;
    }
  }

  isContentPage(chapter: Chapter){
    return this.pageIndex > 0 && this.pageIndex <= this.getPages(chapter).length;
  }

  isConclusion(chapter: Chapter){
    return this.pageIndex === this.getPages(chapter).length + 1;
  }

  prevPage(){
    if(this.pageIndex > 0){
      this.pageIndex--;
    }
  }

  // Donner le feedback selon la réponse
  selectedAnswers: { [pageId: number ]: number | null } = {};
  showFeedback: { [pageId: number ]: boolean } = {};
  isCorrect: { [pageId: number ]: boolean } = {};


  // ---------- Question à réponse unique 
  validateUnique(page: Page){
    if(!page.Exercise || page.Exercise.type !== "UNIQUE") return;

    const pageId = page.id_page;
    this.showFeedback[pageId] = true;

    const selectedId = this.selectedAnswers[pageId];
    const selectedResponse = page.Exercise.UniqueResponses?.find(
      (u: UniqueResponses) => u.id_response === selectedId
    );

    this.isCorrect[pageId] = selectedResponse?.is_correct ?? false;

    
  }

  // ---------- Question key-pairs
  pairsCache: { [pageId: number]: Pairs[] } = {};

  pairsState: {
    [pageId: number]: {
      currentSelection: Pairs[],
      matchedIds: Set<number>,
      wrongIds: Set<number>
    }
  } = {};

  getPairsState(pageId: number) {
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
      this.pairsCache[pageId] = page.Exercise?.Pairs?.sort(() => Math.random() - 0.5) ?? [];
    }
    return this.pairsCache[pageId];
  }

  selectPairs(item: Pairs, page: Page) {
    const pageId = page.id_page;
    const state = this.getPairsState(pageId);

    if (state.matchedIds.has(item.id_response)) return;

    state.currentSelection.push(item);

    if (state.currentSelection.length < 2) return;

    const [a, b] = state.currentSelection;

    if (a.pair_key === b.pair_key) {
      state.matchedIds.add(a.id_response);
      state.matchedIds.add(b.id_response);
      this.checkPairsCompleted(page);
    } else {
      state.wrongIds.add(a.id_response);
      state.wrongIds.add(b.id_response);

      setTimeout(() => {
        state.wrongIds.delete(a.id_response);
        state.wrongIds.delete(b.id_response);
      }, 800);
    }

    state.currentSelection = [];
  }

  checkPairsCompleted(page: Page) {
    const pageId = page.id_page;
    const state = this.getPairsState(pageId);

    const total = page.Exercise?.Pairs?.length ?? 0;

    if (state.matchedIds.size === total) {
      this.showFeedback[pageId] = true;
      this.isCorrect[pageId] = true;
    }
  }

  // ---------- Question put in order
  orderCache: { [pageId: number]: PutInOrders[] } = {};

  getOrderItems(page: Page): PutInOrders[] {
    const pageId = page.id_page;
    if (!this.orderCache[pageId]) {
      this.orderCache[pageId] = [...(page.Exercise?.PutInOrders ?? [])]
      .sort((a, b) => a.mixed_order - b.mixed_order);
    }
    return this.orderCache[pageId];
  }

  drop(event: CdkDragDrop<PutInOrders[]>, page: Page) {
    const list = this.getOrderItems(page);
    moveItemInArray(list, event.previousIndex, event.currentIndex);

    this.getOrderItems(page);
  }

  validateOrder(page: Page){
    const pageId = page.id_page;
    this.showFeedback[pageId] = true;
    const current = this.getOrderItems(page).map(i => i.id_response);
    const correct = [...(page.Exercise?.PutInOrders?? [])]
    .sort((a,b) => a.correct_order - b.correct_order)
    .map(i => i.id_response);

    this.isCorrect[pageId] = 
    JSON.stringify(current) === JSON.stringify(correct);


  }

  ngOnInit(): void {
    
  }

}
