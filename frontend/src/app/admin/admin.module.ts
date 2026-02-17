import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminListChaptersComponent } from './components/admin-list-chapters/admin-list-chapters.component';
import { AdminListUsersComponent } from './components/admin-list-users/admin-list-users.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AdminListChaptersItemComponent } from './components/admin-list-chapters-item/admin-list-chapters-item.component';
import { AdminChapterEditComponent } from './components/admin-chapter-edit/admin-chapter-edit.component';
import { AdminChapterViewComponent } from './components/admin-chapter-view/admin-chapter-view.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule, MatPseudoCheckboxModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    AdminHeaderComponent,
    AdminHomeComponent,
    AdminListChaptersComponent,
    AdminListUsersComponent,
    AdminLayoutComponent,
    AdminListChaptersItemComponent,
    AdminChapterEditComponent,
    AdminChapterViewComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    DragDropModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  exports: [
    AdminHeaderComponent
  ]
})
export class AdminModule { }
