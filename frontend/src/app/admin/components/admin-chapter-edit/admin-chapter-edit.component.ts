import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Chapter } from 'src/app/core/models/chapter.model';
import { Level } from 'src/app/core/models/level.model';
import { AdminLevelService } from '../../services/admin-level.service';
import { Pairs } from 'src/app/core/models/pairs.model';
import { AdminChaptersService } from '../../services/admin-chapters.service';
import { controllers } from 'chart.js';

@Component({
  selector: 'app-admin-chapter-edit',
  templateUrl: './admin-chapter-edit.component.html',
  styleUrls: ['./admin-chapter-edit.component.scss']
})
export class AdminChapterEditComponent implements OnInit {

  constructor(
    private route: ActivatedRoute, 
    private formBuilder: FormBuilder, 
    private router: Router, 
    private adminLevelService: AdminLevelService,
    private adminChaptersService: AdminChaptersService
  ) { }

  // Récupérer le chapter
  adminChapter$: Observable<Chapter> = this.route.data.pipe(
    map(data => data['adminChapter'])
  )

  chapterForm!: FormGroup;
  levels: Level[] = [];
  chapterId! : number;

  ngOnInit(): void {
    this.chapterId = Number(this.route.snapshot.paramMap.get('id'));
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
      order_index: [page.order_index ?? 1],
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

    // Si la réponse correcte existe déjà on la met, sinon on en crée une
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

    // S'il y a des mauvaises responses on les met, sinon on en met une 
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
      this.mapPairsByKey(exercise?.Pairs ?? []).map((pair: any) => 
        this.formBuilder.group({
          pair_key: [pair.pair_key],
          content_left: [pair.content_left],
          content_right: [pair.content_right],
        })
      )
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
      order_index: [this.pages.length + 1],
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
    this.refreshPagesOrderIndex();
  }

  // Changer l'ordre des pages 

  private swapPages(index1: number, index2: number) {
    const pagesArray = this.pages;

    const control1 = pagesArray.at(index1);
    const control2 = pagesArray.at(index2);

    pagesArray.setControl(index1, control2);
    pagesArray.setControl(index2, control1);

    this.refreshPagesOrderIndex();
  }

  private refreshPagesOrderIndex() {
    this.pages.controls.forEach((page, index) => {
      page.get('order_index')?.setValue(index + 1, { emitEvent: false });
    });
  }

  movePageUp(index: number) {
    if (index <= 0) return ;
      this.swapPages(index, index - 1);
  }

  movePageDown(index: number) {
    if (index >= this.pages.length - 1) return ;
    this.swapPages(index, index + 1);
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
    const pairsArray = this.getPairsArray(pageIndex);

    pairsArray.push(
      this.formBuilder.group({
        content_left: [''],
        content_right: [''],
        pair_key: [this.generatePairKey()],
      })
    );
  }

  mapPairsByKey(pairs: Pairs[]): any[] {
    const grouped: any = {};

    pairs.forEach(pair => {
      if (!grouped[pair.pair_key]) {
        grouped[pair.pair_key] = {
          pair_key: pair.pair_key,
          content_left: '',
          content_right: ''
        };
      }

      if(!grouped[pair.pair_key].content_left) {
        grouped[pair.pair_key].content_left = pair.content;
      } else {
        grouped[pair.pair_key].content_right = pair.content;
      }
    });

    return Object.values(grouped);
    
  }

  removePairs(pageIndex: number, index: number){
    this.getPairsArray(pageIndex).removeAt(index);
  }

  

  private generatePairKey(): string {
    return 'pair_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
  }


  // Exercice de type PUT_IN_ORDER
  getOrderTextControl(pageIndex: number): FormControl {
    return this.pages.at(pageIndex)
      .get('exercise.orderText') as FormControl;
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

    this.adminChaptersService
      .updateChapter(this.chapterId, formValue)
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/chapters']);
        },
        error: (err) => {
          console.log('Erreur update chapter',err);
        }
      });

  }

}
