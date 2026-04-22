import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminChaptersService } from '../../services/admin-chapters.service';
import { AdminLevelService } from '../../services/admin-level.service';
import { AdminChapterFormService } from '../../services/form/admin-chapter-form.service';
import { AdminExerciseFormService } from '../../services/form/admin-exercise-form.service';
import { OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Level } from 'src/app/core/models/level.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-chapter-new',
  templateUrl: './admin-chapter-new.component.html',
  styleUrls: ['./admin-chapter-new.component.scss']
})
export class AdminChapterNewComponent implements OnInit {

  constructor(
    private router: Router,
    private adminChaptersService: AdminChaptersService,
    private adminLevelService: AdminLevelService,
    private adminChapterFormService: AdminChapterFormService,
    private adminExerciseFormService: AdminExerciseFormService
  ) { }

  chapterForm!: FormGroup;
  levels: Level[] = [];

  ngOnInit(): void {
    this.adminLevelService.getLevels().subscribe(levels => {
      this.levels = levels.data;
      this.chapterForm = this.adminChapterFormService.initEmptyForm();
    });
  }

  get pages(): FormArray {
    return this.adminChapterFormService.getPages(this.chapterForm);
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

  showMedia: boolean[] = [];

  toggleMedia(index: number): void {
    this.showMedia[index] = !this.showMedia[index];
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

  // Soumettre le chapitre entier
  onSubmit(){
    if (this.chapterForm.invalid) return;

    let formValue = this.chapterForm.value;

    formValue = this.adminExerciseFormService.normalizeOrderExercises(formValue);

    console.log('Payload envoyé', formValue);

    this.adminChaptersService
      .createChapter(formValue)
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/chapters']);
        },
        error: (err) => {
          console.log('Erreur create chapter', err);
        }
      });
  }

}
