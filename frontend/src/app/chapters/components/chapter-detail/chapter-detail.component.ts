import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

@Component({
  selector: 'app-chapter-detail',
  templateUrl: './chapter-detail.component.html',
  styleUrls: ['./chapter-detail.component.scss']
})
export class ChapterDetailComponent implements OnInit, AfterViewInit {

  constructor(
    private route: ActivatedRoute, 
    private userExerciseService: UserExerciseService, 
    public authService: AuthService,
    private chaptersService: ChaptersService
  ) {  }

  startChapter(id_chapter: number): void{
    if(this.authService.isLogged()){
      this.chaptersService.startChapter(id_chapter).subscribe();
    }
  }
  
  pageIndex = 0;

  // Afficher score
  score?: number;
  totalExercises?: number;
  correctExercises?: number;

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

      if(this.isConclusion(chapter) && this.authService.isLogged()){
        this.userExerciseService
        .getChapterScore(chapter.id_chapter)
        .subscribe(res => {
          this.score = res.percentage;
          this.totalExercises = res.total;
          this.correctExercises = res.correct;

          setTimeout(() => {
            this.updateScoreChart();
          })
        });
      }
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

    // Enregistrer le résultat seulement si utilisateur connecté 
    if(this.authService.isLogged()){
      this.userExerciseService
        .saveResult(pageId, this.isCorrect[pageId])
        .subscribe();
    }
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
      this.isCorrect[page.id_page] = true;

      // Enregistrer le résultat seulement si utilisateur connecté 
      if(this.authService.isLogged()){
        this.userExerciseService
          .saveResult(page.id_page, true)
          .subscribe();
      }
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

    // Enregistrer le résultat seulement si utilisateur connecté
    if(this.authService.isLogged()){
      this.userExerciseService
        .saveResult(pageId, this.isCorrect[pageId])
        .subscribe();
    }
  }



  // Envoi des données
  chapter$:Observable<Chapter> = this.route.data.pipe(
    map(data => data['chapter'])
  );

  // Graphique du score
  @ViewChild('scoreChart') scoreChart!: ElementRef<HTMLCanvasElement>;
  scoreChartInstance?: Chart;

  ngAfterViewInit(): void {

  }

  updateScoreChart() {
    if(!this.score || !this.correctExercises || !this.totalExercises) return;

    const data = {
      labels: ['Correct', 'Incorrect'],
      datasets: [
        {
          data: [this.correctExercises, this.totalExercises - this.correctExercises],
          backgroundColor: ['#4caf50', '#f44336'],
        }
      ]
    }

    if(this.scoreChartInstance){
      this.scoreChartInstance.data = data;
      this.scoreChartInstance.update();
    } else {
      this.scoreChartInstance = new Chart(this.scoreChart.nativeElement, {
        type: 'doughnut',
        data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            tooltip: {
              enabled: true
            }
          }
        }
      });
    }
  }

  
    

  





  ngOnInit(): void {}

}
