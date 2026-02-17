import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Chapter } from 'src/app/core/models/chapter.model';
import { Level } from 'src/app/core/models/level.model';
import { AdminLevelService } from '../../services/admin-level.service';

@Component({
  selector: 'app-admin-chapter-edit',
  templateUrl: './admin-chapter-edit.component.html',
  styleUrls: ['./admin-chapter-edit.component.scss']
})
export class AdminChapterEditComponent implements OnInit {

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router, private adminLevelService: AdminLevelService) { }

  // Récupérer le chapter
  adminChapter$: Observable<Chapter> = this.route.data.pipe(
    map(data => data['adminChapter'])
  )

  chapterForm!: FormGroup;
  levels: Level[] = []

  ngOnInit(): void {
    this.adminLevelService.getLevels().subscribe(levels => {
      this.levels = levels.data;
       this.adminChapter$.subscribe(chapter => {
        this.initForm(chapter);
      })
    })
   
  }

  // Initialiser le formulaire avec les infos du chapitre
  initForm(chapter: Chapter){
    this.chapterForm = this.formBuilder.group({
      title: [chapter.title],
      title_fr: [chapter.title_fr],
      abstract: [chapter.abstract],
      level: [chapter.Level?.title],
      pages: this.formBuilder.array(
        chapter.Pages?.map(page => this.createPageGroup(page)) ?? []
      )
    })
  }

  // Créer une page + infos de la page (type)
  createPageGroup(page: any): FormGroup {
    return this.formBuilder.group({
      id_page: [page.id_page],
      type: [page.type],
      lesson: this.createLessonGroup(page.Lesson),
      exercise: this.createExerciseGroup(page.Exercise)
    });
  }

  // Créer une leçon dans la page
  createLessonGroup(lesson: any): FormGroup {
    return this.formBuilder.group({
      title: [lesson?.title],
      content: [lesson?.content],
    });
  }

  // Créer un exercice dans la page
  createExerciseGroup(exercise: any): FormGroup {
    return this.formBuilder.group({
      question: [exercise?.question],
      type: [exercise?.type],
      feedback: [exercise?.feedback],

      uniqueResponses: this.formBuilder.array(
        exercise?.UniqueResponses?.map((u: any) =>
          this.formBuilder.group({
            id_response: [u.id_response],
            content: [u.content],
            is_correct: [u.is_correct],
          })
        ) ?? []
      ),

      pairs: this.formBuilder.array(
        exercise?.Pairs?.map((p: any) =>
          this.formBuilder.group({
            id_response: [p.id_response],
            content: [p.content],
            pair_key: [p.pair_key],
          })
        ) ?? []
      ),

      putInOrders: this.formBuilder.array(
        exercise?.PutInOrders?.map((p: any) =>
          this.formBuilder.group({
            id_response: [p.id_response],
            content: [p.content],
            mixed_order: [p.mixed_order],
            correct_order: [p.correct_order],
          })
        ) ?? []
      )
    });
  }


  get pages(): FormArray {
    return this.chapterForm.get('pages') as FormArray;
  }

  getUniqueArray(pageIndex: number): FormArray {
    return this.pages.at(pageIndex).get('exercise.uniqueResponses') as FormArray;
  }

  getPairsArray(pageIndex: number): FormArray {
    return this.pages.at(pageIndex).get('exercise.pairs') as FormArray;
  }

  getOrderArray(pageIndex: number): FormArray {
    return this.pages.at(pageIndex).get('exercise.putInOrders') as FormArray;
  }

addPage(){
  this.pages.push(
    this.formBuilder.group({
      id_page: [0],
      type: ['LESSON'],

      lesson: this.formBuilder.group({
        title: [''],
        content: [''],
      }),

      exercise: this.formBuilder.group({
        question: [''],
        type: ['UNIQUE'],
        feedback: [''],

        uniqueResponses: this.formBuilder.array([]),
        pairs: this.formBuilder.array([]),
        putInOrders: this.formBuilder.array([]),
      })
    })
  );
}

  removePage(index: number){
    this.pages.removeAt(index);
  }


  // Exercice de type UNIQUE 
  addUniqueResponse(pageIndex: number){
    this.getUniqueArray(pageIndex).push(
      this.formBuilder.group({
        content: [''],
        is_correct: [false],
      })
    );
  }

  removeUniqueResponse(pageIndex: number, index: number){
    this.getUniqueArray(pageIndex).removeAt(index);
  }


  // Exercice de type PAIRS
  addPairs(pageIndex: number){
    this.getPairsArray(pageIndex).push(
      this.formBuilder.group({
        content: [''],
        pair_key: [''],
      })
    );
  }

  removePairs(pageIndex: number, index: number){
    this.getPairsArray(pageIndex).removeAt(index);
  }


  // Exercice de type PUT_IN_ORDER
  addOrderItem(pageIndex: number){
    const orderArray = this.getOrderArray(pageIndex);
    orderArray.push(
      this.formBuilder.group({
        content: [''],
        mixed_order: [orderArray.length + 1],
        correct_order: [orderArray.length + 1],
      })
    );
  }

  removeOrderItem(pageIndex: number, index: number){
    this.getOrderArray(pageIndex).removeAt(index);
  }





  // Soumettre le chapitre entier

  onSubmit(){
    if(this.chapterForm.invalid) return;

    const updatedChapter = this.chapterForm.value;

    console.log(updatedChapter);

    // Route d'update du chapter

    this.router.navigate(['/admin/chapters']);
  }

}
