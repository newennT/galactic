import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Chapter } from 'src/app/core/models/chapter.model';
import { Page } from 'src/app/core/models/page.model';
import { UniqueResponses } from 'src/app/core/models/uniqueResponses.model';

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
  

  // Envoi des données
  chapter$:Observable<Chapter> = this.route.data.pipe(
    map(data => data['chapter'])
  );

  constructor(private route: ActivatedRoute) {  }

  ngOnInit(): void {}

}
