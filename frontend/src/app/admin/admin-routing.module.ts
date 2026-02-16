import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminListChaptersComponent } from './components/admin-list-chapters/admin-list-chapters.component';
import { AdminListUsersComponent } from './components/admin-list-users/admin-list-users.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { adminChaptersResolver } from './resolvers/admin-chapters.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminHomeComponent },
      { path: 'chapters', component: AdminListChaptersComponent, resolve: { adminChapters: adminChaptersResolver }},
      { path: 'users', component: AdminListUsersComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
