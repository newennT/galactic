import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Chapter } from 'src/app/core/models/chapter.model';
import { Page } from 'src/app/core/models/page.model';
import { UniqueResponses } from 'src/app/core/models/uniqueResponses.model';
import { Pairs } from 'src/app/core/models/pairs.model';
import { PutInOrders } from 'src/app/core/models/putInOrders.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UserExerciseService } from '../../services/userExercise.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChaptersService } from '../../services/chapters.service';
import { ChapterNavigatorService } from '../../services/chapterNavigator.service';
import { ChapterExercisesService } from '../../services/chapterExercises.service';
import { ScoreChartService } from '../../services/scoreChart.service';
import { ChapterExerciseYoutubeService } from '../../services/chapterExerciseYoutube.service';

@Component({
  selector: 'app-chapter-detail',
  templateUrl: './chapter-detail.component.html',
  styleUrls: ['./chapter-detail.component.scss']
})
export class ChapterDetailComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute, 
    private userExerciseService: UserExerciseService, 
    public authService: AuthService,
    private chaptersService: ChaptersService,
    public chapterNavigatorService: ChapterNavigatorService,
    public chapterExercisesService: ChapterExercisesService,
    public scoreChartService: ScoreChartService,
    public chapterExerciseYoutubeService: ChapterExerciseYoutubeService
  ) {  }

  startChapter(id_chapter: number): void{
    if(this.authService.isLogged()){
      this.chaptersService.startChapter(id_chapter).subscribe();
    }
  }

  nextPage(chapter: Chapter) {
    const moved = this.chapterNavigatorService.next(chapter);
    if (
      moved && this.chapterNavigatorService.isConclusion(chapter) && this.authService.isLogged()
    ) {
      this.loadScore(chapter);
    }
  }

  // Calcul du score
  score?: number;
  totalExercises?: number;
  correctExercises?: number;

  loadScore(chapter: Chapter): void {
    this.userExerciseService.getChapterScore(chapter.id_chapter).subscribe(res => {
      this.score = res.percentage;
      this.totalExercises = res.total;
      this.correctExercises = res.correct;
      setTimeout(() => this.updateScoreChart());
    });
  }

  // Donner le feedback selon la réponse
  showFeedback: { [pageId: number ]: boolean } = {};
  isCorrect: { [pageId: number ]: boolean } = {};

  // ---------- Question à réponse unique 
  validateUnique(page: Page){
    const pageId = page.id_page;
    this.showFeedback[pageId] = true;
    const correct = this.chapterExercisesService.validateUnique(page);

    this.isCorrect[pageId] = correct;

    if(this.authService.isLogged()){
      this.userExerciseService.saveResult(pageId, correct).subscribe();
    }
  }

  // ---------- Question key-pairs
  selectPairs(item: Pairs, page: Page) {
    const completed = this.chapterExercisesService.selectPair(item, page);

    if (!completed) { return; }

    const pageId = page.id_page;
    this.showFeedback[pageId] = true;
    this.isCorrect[pageId] = true;
    if (this.authService.isLogged()) {
      this.userExerciseService.saveResult(pageId, true).subscribe();
    }
  }

  // ---------- Question put in order
  drop(event: CdkDragDrop<PutInOrders[]>, page: Page) {
    this.chapterExercisesService.moveOrderItem(page, event.previousIndex, event.currentIndex);
  }

  validateOrder(page: Page){
    const pageId = page.id_page;
    this.showFeedback[pageId] = true;
    const correct = this.chapterExercisesService.validateOrder(page);
    this.isCorrect[pageId] = correct;

    if(this.authService.isLogged()){
      this.userExerciseService.saveResult(pageId, correct).subscribe();
    }    
  }

  // Question avec audio
  playingAudio: { [pageId: number]: boolean } = {};

  toggleAudio(audio: HTMLAudioElement, pageId: number): void {

    if (audio.paused) {
      audio.play();
      this.playingAudio[pageId] = true;
    } else {
      audio.pause();
      this.playingAudio[pageId] = false;
    }

  }

  // Envoi des données
  chapter$:Observable<Chapter> = this.route.data.pipe(
    map(data => data['chapter'])
  );

  // Graphique du score
  @ViewChild('scoreChart') scoreChart!: ElementRef<HTMLCanvasElement>;

  updateScoreChart(): void {
    if( !this.scoreChart?.nativeElement || this.correctExercises === undefined || this.totalExercises === undefined ) {
      return;
    }
    this.scoreChartService.render(this.scoreChart.nativeElement, this.correctExercises, this.totalExercises);
  }

  ngOnInit(): void {
    this.chapterNavigatorService.reset();
  }

  ngOnDestroy(): void {
    this.scoreChartService.destroy();
  }

}
