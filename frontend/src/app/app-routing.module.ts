import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ContactComponent } from "./contact/contact.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { AboutComponent } from "./about/about.component";

const routes: Routes = [
    { path: 'chapters', loadChildren: () => import('./chapters/chapters.module').then(m => m.ChaptersModule) },
    { path: 'panel', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    { path: '', component: HomeComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'about', component: AboutComponent},
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }