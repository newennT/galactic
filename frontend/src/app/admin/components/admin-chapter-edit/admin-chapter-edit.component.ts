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
import { AdminChapterFormService } from '../../services/form/admin-chapter-form.service';
import { AdminExerciseFormService } from '../../services/form/admin-exercise-form.service';

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
    private adminChaptersService: AdminChaptersService,
    private adminExerciseFormService: AdminExerciseFormService,
    private adminChapterFormService: AdminChapterFormService
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
        this.chapterForm = this.adminChapterFormService.initForm(chapter);
      });
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

  addPage() {
    this.adminChapterFormService.addPage(this.chapterForm);
  }

  removePage(index: number) {
    this.adminChapterFormService.removePage(this.chapterForm, index);
  }

  movePageUp(index: number) {
    this.adminChapterFormService.movePageUp(this.chapterForm, index);
  }

  movePageDown(index: number) {
    this.adminChapterFormService.movePageDown(this.chapterForm, index);
  }

  tinyConfig = {
    base_url: '/assets/tinymce',
    suffix: '.min',
    height: 300,
    menubar: false,
    plugins: 'lists link',
    toolbar: 'blocks | bold italic underline | bullist numlist | link | removeformat',
    branding: false
  };

  showMedia: boolean[] = [];

  toggleMedia(index: number): void {
    this.showMedia[index] = !this.showMedia[index];
  }

  // Exercice de type UNIQUE
  addUniqueResponse(pageIndex: number) {
    this.adminExerciseFormService.addUniqueResponse(
      this.getUniqueArray(pageIndex)
    );
  }

  removeUniqueResponse(pageIndex: number, index: number) {
    this.adminExerciseFormService.removeUniqueResponse(
      this.getUniqueArray(pageIndex),
      index
    );
  }

  // Exercice de type PAIRS
  addPairs(pageIndex: number) {
    this.adminExerciseFormService.addPair(
      this.getPairsArray(pageIndex)
    );
  }

  removePairs(pageIndex: number, index: number) {
    this.adminExerciseFormService.removePair(
      this.getPairsArray(pageIndex),
      index
    );
  }

   // Exercice de type PUT_IN_ORDER
  getOrderTextControl(pageIndex: number): FormControl {
    return this.adminExerciseFormService.getOrderTextControl(
      this.pages.at(pageIndex) as FormGroup
    );
  }

  onSubmit() {

    if (this.chapterForm.invalid) return;

    let formValue = this.chapterForm.value;

    formValue = this.adminExerciseFormService.normalizeOrderExercises(formValue);

    this.adminChaptersService
      .updateChapter(this.chapterId, formValue)
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/chapters']);
        },
        error: (err) => {
          console.log('Erreur update chapter', err);
        }
      });
  }





}
