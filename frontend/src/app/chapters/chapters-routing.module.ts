import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChaptersListComponent } from './components/chapters-list/chapters-list.component';
import { chaptersResolver } from './resolvers/chapters.resolver';
import { chapterDetailResolver } from './resolvers/chapter-detail.resolver';
import { ChapterDetailComponent } from './components/chapter-detail/chapter-detail.component';

const routes: Routes = [
  {
    path: '', component: ChaptersListComponent, resolve: { chapters: chaptersResolver }
  },
  {
    path: ':id', component: ChapterDetailComponent, resolve: { chapter: chapterDetailResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChaptersRoutingModule { }
