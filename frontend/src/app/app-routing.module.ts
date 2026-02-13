import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { AboutComponent } from "./about/about.component";
import { AuthGuard } from "./core/guards/auth.guard";
import { AdminGuard } from "./core/guards/admin.guard";
import { MainLayoutComponent } from "./layout/main-layout/main-layout.component";

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'about', component: AboutComponent },
            { path: 'dashboard', canActivate: [AuthGuard], loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'chapters', loadChildren: () => import('./chapters/chapters.module').then(m => m.ChaptersModule) },
            { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }
        ]
    },
    { path: 'admin', canActivate: [AuthGuard, AdminGuard], loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }