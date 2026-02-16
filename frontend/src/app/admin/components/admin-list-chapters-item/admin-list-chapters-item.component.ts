import { Component, OnInit, Input } from '@angular/core';
import { Chapter } from 'src/app/core/models/chapter.model';

@Component({
  selector: 'app-admin-list-chapters-item',
  templateUrl: './admin-list-chapters-item.component.html',
  styleUrls: ['./admin-list-chapters-item.component.scss']
})
export class AdminListChaptersItemComponent implements OnInit {
  @Input() adminChapter!: Chapter;

  ngOnInit(): void {
    
  }

}
