import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Chapter } from 'src/app/core/models/chapter.model';
import { AdminExerciseFormService } from './admin-exercise-form.service';

@Injectable({
  providedIn: 'root'
})
export class AdminChapterFormService {

  constructor(
    private formBuilder: FormBuilder,
    private adminExerciseFormService: AdminExerciseFormService
  ) {}

  initForm(chapter: Chapter): FormGroup {
    return this.formBuilder.group({
      title: [chapter.title],
      title_fr: [chapter.title_fr],
      abstract: [chapter.abstract],
      id_level: [chapter.id_level],
      pages: this.formBuilder.array(
        chapter.Pages?.map(page => this.createPageGroup(page)) ?? []
      )
    });
  }

  initEmptyForm(): FormGroup {
    return this.formBuilder.group({
      title: [''],
      title_fr: [''],
      abstract: [''],
      id_level: [''],
      pages: this.formBuilder.array([])
    });
  }

  createPageGroup(page: any): FormGroup {
    return this.formBuilder.group({
      id_page: [page?.id_page ?? 0],
      type: [page?.type ?? 'LESSON'],
      order_index: [page?.order_index ?? 1],
      lesson: this.createLessonGroup(page?.Lesson),
      exercise: this.adminExerciseFormService.createExerciseGroup(page?.Exercise)
    });
  }

  createLessonGroup(lesson: any): FormGroup {
    return this.formBuilder.group({
      title: [lesson?.title ?? ''],
      content: [lesson?.content ?? ''],
    });
  }

  getPages(form: FormGroup): FormArray {
    return form.get('pages') as FormArray;
  }

  addPage(form: FormGroup): void {
    const pages = this.getPages(form);

    pages.push(
      this.formBuilder.group({
        id_page: [0],
        order_index: [pages.length + 1],
        type: ['LESSON'],

        lesson: this.formBuilder.group({
          title: [''],
          content: [''],
        }),

        exercise: this.formBuilder.group({
          question: [''],
          type: ['UNIQUE'],
          feedback: [''],
          media_type: [''],
          media_url: [''],

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
          orderText: ['']
        })
      })
    );
  }

  removePage(form: FormGroup, index: number): void {
    this.getPages(form).removeAt(index);
    this.refreshPagesOrderIndex(form);
  }

  movePageUp(form: FormGroup, index: number): void {
    if (index <= 0) return;
    this.swapPages(form, index, index - 1);
  }

  movePageDown(form: FormGroup, index: number): void {
    if (index >= this.getPages(form).length - 1) return;
    this.swapPages(form, index, index + 1);
  }

  private swapPages(form: FormGroup, index1: number, index2: number): void {
    const pagesArray = this.getPages(form);

    const control1 = pagesArray.at(index1);
    const control2 = pagesArray.at(index2);

    pagesArray.setControl(index1, control2);
    pagesArray.setControl(index2, control1);

    this.refreshPagesOrderIndex(form);
  }

  private refreshPagesOrderIndex(form: FormGroup): void {
    this.getPages(form).controls.forEach((page, index) => {
      page.get('order_index')?.setValue(index + 1, { emitEvent: false });
    });
  }
}