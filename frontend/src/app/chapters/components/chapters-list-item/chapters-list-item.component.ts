import { Component, Input, OnInit } from '@angular/core';
import { Chapter } from 'src/app/core/models/chapter.model';
import { AdminRoutingModule } from "src/app/admin/admin-routing.module";

@Component({
  selector: 'app-chapters-list-item',
  templateUrl: './chapters-list-item.component.html',
  styleUrls: ['./chapters-list-item.component.scss'],

})
export class ChaptersListItemComponent implements OnInit {
  @Input() chapter!: Chapter;

  ngOnInit(): void {
    
  }
}
