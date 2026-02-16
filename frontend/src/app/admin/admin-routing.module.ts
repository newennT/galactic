import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminListChaptersComponent } from './components/admin-list-chapters/admin-list-chapters.component';
import { AdminListUsersComponent } from './components/admin-list-users/admin-list-users.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { adminChaptersResolver } from './resolvers/admin-chapters.resolver';
import { AdminChapterViewComponent } from './components/admin-chapter-view/admin-chapter-view.component';
import { AdminChapterEditComponent } from './components/admin-chapter-edit/admin-chapter-edit.component';
import { adminChapterDetailResolver } from './resolvers/admin-chapter-detail.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminHomeComponent },
      { path: 'chapters', component: AdminListChaptersComponent, resolve: { adminChapters: adminChaptersResolver }},
      { path: 'chapters/:id', component: AdminChapterViewComponent, resolve: { adminChapter: adminChapterDetailResolver }},
      { path: 'chapters/:id/edit', component: AdminChapterEditComponent },
      { path: 'users', component: AdminListUsersComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
