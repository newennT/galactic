import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Chapter } from 'src/app/core/models/chapter.model';

@Component({
  selector: 'app-admin-chapter-edit',
  templateUrl: './admin-chapter-edit.component.html',
  styleUrls: ['./admin-chapter-edit.component.scss']
})
export class AdminChapterEditComponent implements OnInit {

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) { }

  // Récupérer le chapter
  adminChapter$: Observable<Chapter> = this.route.data.pipe(
    map(data => data['adminChapter'])
  )

  chapterForm!: FormGroup;

  ngOnInit(): void {
    this.adminChapter$.subscribe(chapter => {
      this.initForm(chapter);
    })
  }

  initForm(chapter: Chapter){
    this.chapterForm = this.formBuilder.group({
      title: [chapter.title],
      title_fr: [chapter.title_fr],
      abstract: [chapter.abstract],
      pages: this.formBuilder.array(
        chapter.Pages?.map(page => this.createPageGroup(page)) ?? []
      )
    })
  }

  createPageGroup(page: any): FormGroup {
    return this.formBuilder.group({
      id_page: [page.id_page],
      type: [page.type],
      lesson: this.formBuilder.group({
        title: [page.Lesson?.title],
        content: [page.Lesson?.content],
      }),
      exercise: this.formBuilder.group({
        question: [page.Exercise?.question],
        type: [page.Exercise?.type],
        feedback: [page.Exercise?.feedback],
      })
    })
  }

  get pages(): FormArray {
    return this.chapterForm.get('pages') as FormArray;
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
        })
      })
    )
  }

  removePage(index: number){
    this.pages.removeAt(index);
  }

  onSubmit(){
    if(this.chapterForm.invalid) return;

    const updatedChapter = this.chapterForm.value;

    console.log(updatedChapter);

    // Route d'update du chapter

    this.router.navigate(['/admin/chapters']);
  }

}
