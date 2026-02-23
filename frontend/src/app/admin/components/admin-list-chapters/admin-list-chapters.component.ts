import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Chapter } from 'src/app/core/models/chapter.model';
import { AdminChaptersService } from '../../services/admin-chapters.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-admin-list-chapters',
  templateUrl: './admin-list-chapters.component.html',
  styleUrls: ['./admin-list-chapters.component.scss']
})
export class AdminListChaptersComponent implements OnInit {
  adminChapters$!: Observable<Chapter[]>;
  reorderMode = false;
  chapters: Chapter[] = [];

  constructor(private route: ActivatedRoute, private adminChaptersService: AdminChaptersService){}

  ngOnInit(): void {
    this.adminChapters$ = this.route.data.pipe(
      map(data => data['adminChapters'])
    );
    this.adminChapters$.subscribe(data => {
      this.chapters = [...data].sort((a, b) => a.order - b.order);
    })
  }

  toggleReorderMode() {
    this.reorderMode = !this.reorderMode;
  }

  drop(event: CdkDragDrop<Chapter[]>) {
    moveItemInArray(
      this.chapters,
      event.previousIndex,
      event.currentIndex
    );

    this.updateOrders();
  }

  moveUp(index: number){
    if(index === 0) return;
    [this.chapters[index - 1], this.chapters[index]] = [this.chapters[index], this.chapters[index - 1]];
    this.updateOrders();
  }

  moveDown(index: number){
    if(index === this.chapters.length - 1) return;
    [this.chapters[index + 1], this.chapters[index]] = [this.chapters[index], this.chapters[index + 1]];
    this.updateOrders();
  }

  updateOrders(){
    this.chapters.forEach((chapter, index) => {
      chapter.order = index + 1;
    });
  }

  saveOrder(){
    const payload = this.chapters.map(chapter => ({
      id_chapter: chapter.id_chapter,
      order: chapter.order
    }));

    this.adminChaptersService.reorder(payload)
      .subscribe({
        next: () => {
          this.reorderMode = false;
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
}
