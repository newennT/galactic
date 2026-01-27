import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ContactComponent } from "./contact/contact.component";
import { NotFoundComponent } from "./not-found/not-found.component";

const routes: Routes = [
    { path: 'chapters', loadChildren: () => import('./chapters/chapters.module').then(m => m.ChaptersModule) },
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    { path: '', component: HomeComponent },
    { path: 'contact', component: ContactComponent },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }