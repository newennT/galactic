import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
    let uniqueResponsesArray = this.formBuilder.array<FormGroup>([]);
    if (exercise?.UniqueResponses?.length) {

    const correct = exercise.UniqueResponses.find((u: any) => u.is_correct);
    const wrong = exercise.UniqueResponses.filter((u: any) => !u.is_correct);

    if (correct) {
      uniqueResponsesArray.push(
        this.formBuilder.group({
          id_response: [correct.id_response],
          content: [correct.content],
          is_correct: [true],
        })
      );
    } else {
      uniqueResponsesArray.push(
        this.formBuilder.group({
          id_response: [0],
          content: [''],
          is_correct: [true],
        })
      );
    }

    if (wrong?.length > 0) {
      wrong.forEach((u: any) => {
        uniqueResponsesArray.push(
          this.formBuilder.group({
            id_response: [u.id_response],
            content: [u.content],
            is_correct: [false],
          })
        );
      });
    } else {
      uniqueResponsesArray.push(
        this.formBuilder.group({
          id_response: [0],
          content: [''],
          is_correct: [false],
        })
      );
    }

  } else {
    uniqueResponsesArray.push(
      this.formBuilder.group({
        id_response: [0],
        content: [''],
        is_correct: [true],
      })
    );

    // Une mauvaise réponse par défaut
    uniqueResponsesArray.push(
      this.formBuilder.group({
        id_response: [0],
        content: [''],
        is_correct: [false],
      })
    );
  }

  const isOrder = exercise?.type === 'ORDER';
  let orderText = '';
  if (isOrder && exercise?.PutInOrders?.length) {
    orderText = exercise.PutInOrders
      .sort((a: any, b: any) => a.correct_order - b.correct_order)
      .map((p: any) => p.content)
      .join(';');
  }

  return this.formBuilder.group({
    question: [exercise?.question ?? ''],
    type: [exercise?.type ?? 'UNIQUE'],
    feedback: [exercise?.feedback ?? ''],
    uniqueResponses: uniqueResponsesArray,

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
      []
    ),
    orderText: [orderText],
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

        uniqueResponses: this.formBuilder.array([
          this.formBuilder.group({
            id_response: [0],
            content: [''],
            is_correct: [true],
          }),
          this.formBuilder.group({
            id_response: [0],
            content: [''],
            is_correct: [false],
          }),
        ]),
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

removeUniqueResponse(pageIndex: number, index: number) {
  const array = this.getUniqueArray(pageIndex);
  const control = array.at(index);
  const isCorrect = control.get('is_correct')?.value;
  if (!isCorrect) {
    const wrongCount = array.controls.filter(c => !c.get('is_correct')?.value).length;
    if (wrongCount <= 1) {
      return;
    }
  }
  array.removeAt(index);
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
  getOrderTextControl(pageIndex: number): FormControl {
    const control = this.pages.at(pageIndex).get('exercise.orderText');
    if (control instanceof FormControl) {
      return control;
    } else {
      return new FormControl('');
    }
  }



  // Soumettre le chapitre entier

  onSubmit(){
    if(this.chapterForm.invalid) return;
    const formValue = this.chapterForm.value;

    formValue.pages.forEach((page: any) => {
      if(page.type === 'EXERCISE' && page.exercise.type === 'ORDER') {
        const segments = page.exercise.orderText
          .split(';')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);

        page.exercise.putInOrders = segments.map((content: string, index: number) => ({
          content,
          correct_order: index + 1,
          mixed_order: index + 1
        }));

        for (let i = page.exercise.putInOrders.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [page.exercise.putInOrders[i].mixed_order, page.exercise.putInOrders[j].mixed_order] =
            [page.exercise.putInOrders[j].mixed_order, page.exercise.putInOrders[i].mixed_order];
        }
      }
    });

    console.log(formValue);

    // Envoi au back

    this.router.navigate(['/admin/chapters']);
  }

}
