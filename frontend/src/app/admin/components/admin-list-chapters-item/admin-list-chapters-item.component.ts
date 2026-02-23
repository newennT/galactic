import { Component, OnInit, Input, Output } from '@angular/core';
import { Chapter } from 'src/app/core/models/chapter.model';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-list-chapters-item',
  templateUrl: './admin-list-chapters-item.component.html',
  styleUrls: ['./admin-list-chapters-item.component.scss']
})
export class AdminListChaptersItemComponent implements OnInit {
  @Input() adminChapter!: Chapter;
  @Input() reorderMode!: boolean;
  @Input() index!: number;

  @Output() moveUpEvent = new EventEmitter<number>();
  @Output() moveDownEvent = new EventEmitter<number>();

  ngOnInit(): void {
    
  }

  moveUp(){
    this.moveUpEvent.emit(this.index);
  }

  moveDown(){
    this.moveDownEvent.emit(this.index);
  }

}
