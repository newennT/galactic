import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Chapter } from 'src/app/core/models/chapter.model';
import { map } from 'rxjs/operators';
import { Page } from 'src/app/core/models/page.model';
import { Pairs } from 'src/app/core/models/pairs.model';
import { PutInOrders } from 'src/app/core/models/putInOrders.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AdminChapterNavigatorService } from '../../services/admin-chapterNavigator.service';
import { AdminChapterExercisesService } from '../../services/admin-chapterExercises.service';
import { AdminChapterExerciseYoutubeService } from '../../services/admin-chapterExerciseYoutube.service';

@Component({
  selector: 'app-admin-chapter-view',
  templateUrl: './admin-chapter-view.component.html',
  styleUrls: ['./admin-chapter-view.component.scss']
})
export class AdminChapterViewComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    public adminChapterNavigatorService: AdminChapterNavigatorService,
    public adminChapterExercisesService: AdminChapterExercisesService,
    public chapterExerciseYoutubeService: AdminChapterExerciseYoutubeService
  ){}

  // Récupérer le chapter
  adminChapter$: Observable<Chapter> = this.route.data.pipe(
    map(data => data['adminChapter'])
  )


  // Pagination du chapter
  pageIndex = 0;


  // Donner le feedback selon la réponse
  showFeedback: { [pageId: number ]: boolean } = {};
  isCorrect: { [pageId: number ]: boolean } = {};


  // ---------- Question à réponse unique 
 validateUnique(page: Page){
    const pageId = page.id_page;
    this.showFeedback[pageId] = true;
    const correct = this.adminChapterExercisesService.validateUnique(page);

    this.isCorrect[pageId] = correct;
  }

  // ---------- Question key-pairs
  selectPairs(item: Pairs, page: Page) {
    const completed = this.adminChapterExercisesService.selectPair(item, page);

    if (!completed) {
      return;
    }
    const pageId = page.id_page;
    this.showFeedback[pageId] = true;
    this.isCorrect[pageId] = true;
  }

  // ---------- Question put in order
  drop(event: CdkDragDrop<PutInOrders[]>, page: Page) {
    this.adminChapterExercisesService.moveOrderItem(page, event.previousIndex, event.currentIndex);
  }

  validateOrder(page: Page){
    const pageId = page.id_page;
    this.showFeedback[pageId] = true;
    const correct = this.adminChapterExercisesService.validateOrder(page);
    this.isCorrect[pageId] = correct;   
  }


  ngOnInit(): void {
    this.adminChapterNavigatorService.reset();
  }

}
