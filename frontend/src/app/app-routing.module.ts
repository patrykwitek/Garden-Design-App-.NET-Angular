import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { ProjectsComponent } from './components/projects/projects.component';
import { TestErrorsComponent } from './components/test-errors/test-errors.component';
import { AuthorComponent } from './components/author/author.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { AppInfoComponent } from './components/app-info/app-info.component';
import { SettingsComponent } from './components/settings/settings.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { AdminComponent } from './components/admin/admin/admin.component';
import { adminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'projects', component: ProjectsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'editProfile', component: EditProfileComponent },
      { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
    ]
  },
  { path: 'errors-testing', component: TestErrorsComponent },
  { path: 'about-author', component: AuthorComponent },
  { path: 'about-app', component: AppInfoComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
