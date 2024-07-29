import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { TestErrorsComponent } from './components/test-errors/test-errors.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { SettingsComponent } from './dialogs/settings/settings.component';
import { EditProfileComponent } from './dialogs/edit-profile/edit-profile.component';
import { AdminComponent } from './components/admin/admin/admin.component';
import { adminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'admin', component: AdminComponent, canActivate: [adminGuard] }
    ]
  },
  { path: 'errors-testing', component: TestErrorsComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
