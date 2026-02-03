import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Chapter } from 'src/app/core/models/chapter.model';
import { Page } from 'src/app/core/models/page.model';
import { UniqueResponses } from 'src/app/core/models/uniqueResponses.model';
import { Pairs } from 'src/app/core/models/pairs.model';

@Component({
  selector: 'app-chapter-detail',
  templateUrl: './chapter-detail.component.html',
  styleUrls: ['./chapter-detail.component.scss']
})
export class ChapterDetailComponent implements OnInit{

  pageIndex = 0;

  // Pagination du chapter
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
  currentSelection: Pairs[] = [];
  matchedIds = new Set<number>();
  wrongIds = new Set<number>();

  pairsCache: { [pageId: number]: Pairs[] } = {};

  getShuffledPairs(page: Page): Pairs[] {
    const pageId = page.id_page;
    if (!this.pairsCache[pageId]) {
      this.pairsCache[pageId] = page.Exercise?.Pairs?.sort(() => Math.random() - 0.5) ?? [];
    }
    return this.pairsCache[pageId];
  }

  selectPairs(item: Pairs, page: Page){
    if(this.matchedIds.has(item.id_response)) return;

    this.currentSelection.push(item);
    if(this.currentSelection.length < 2) return;
    const [a, b] = this.currentSelection;

    if(a.pair_key === b.pair_key){
      this.matchedIds.add(a.id_response);
      this.matchedIds.add(b.id_response);
      this.checkPairsCompleted(page);
    } else {
      this.wrongIds.add(a.id_response);
      this.wrongIds.add(b.id_response);

      setTimeout(() => {
        this.wrongIds.delete(a.id_response);
        this.wrongIds.delete(b.id_response);
      }, 800);
    }

    this.currentSelection = [];
  }

  checkPairsCompleted(page: Page){
    const total = page.Exercise?.Pairs?.length ?? 0;

    if(this.matchedIds.size === total){
      this.showFeedback[page.id_page] = true;
    }
  }
  

  // Envoi des données
  chapter$:Observable<Chapter> = this.route.data.pipe(
    map(data => data['chapter'])
  );

  constructor(private route: ActivatedRoute) {  }

  ngOnInit(): void {}

}
