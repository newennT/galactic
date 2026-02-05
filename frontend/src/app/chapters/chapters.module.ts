import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChaptersRoutingModule } from './chapters-routing.module';
import { ChaptersListComponent } from './components/chapters-list/chapters-list.component';
import { ChaptersListItemComponent } from './components/chapters-list-item/chapters-list-item.component';
import { ChapterDetailComponent } from './components/chapter-detail/chapter-detail.component';
import { FormsModule } from '@angular/forms';
import { CoreModule } from "src/app/core/core.module";
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    ChaptersListComponent,
    ChaptersListItemComponent,
    ChapterDetailComponent,
  ],
  imports: [
    CommonModule,
    ChaptersRoutingModule,
    FormsModule,
    CoreModule,
    DragDropModule
]
})
export class ChaptersModule { }
