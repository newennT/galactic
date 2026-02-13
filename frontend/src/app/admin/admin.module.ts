import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminListChaptersComponent } from './components/admin-list-chapters/admin-list-chapters.component';
import { AdminListUsersComponent } from './components/admin-list-users/admin-list-users.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';


@NgModule({
  declarations: [
    AdminHeaderComponent,
    AdminHomeComponent,
    AdminListChaptersComponent,
    AdminListUsersComponent,
    AdminLayoutComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  exports: [
    AdminHeaderComponent
  ]
})
export class AdminModule { }
