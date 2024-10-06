import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { ClickOutsideDirective } from './directives/clickOutside.directive';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from './shared-modules/shared.module';
import { HomeComponent } from './components/home/home.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { AuthorComponent } from './components/author/author.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from './shared-components/text-input/text-input.component';
import { AppInfoComponent } from './components/app-info/app-info.component';
import { RegisterComponent } from './components/register/register.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { DatePickerComponent } from './shared-components/date-picker/date-picker.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { SettingsComponent } from './dialogs/settings/settings.component';
import { EditProfileComponent } from './dialogs/edit-profile/edit-profile.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateNewProjectComponent } from './dialogs/create-new-project/create-new-project.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ProjectsListComponent } from './dialogs/projects-list/projects-list.component';
import { BackButtonComponent } from './shared-components/back-button/back-button.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { NavGardenOptionsComponent } from './components/nav-garden-options/nav-garden-options.component';
import { ThemeToogleSwitchComponent } from './shared-components/theme-toogle-switch/theme-toogle-switch.component';
import { ConfirmationComponent } from './dialogs/confirmation/confirmation.component';
import { EditProjectComponent } from './dialogs/edit-project/edit-project.component';
import { SlidebarComponent } from './components/slidebar/slidebar.component';
import { AdminHomePageComponent } from './components/admin/admin-home-page/admin-home-page.component';
import { AllUsersProjectsListComponent } from './components/admin/all-users-projects-list/all-users-projects-list.component';
import { SetRolesComponent } from './components/admin/set-roles/set-roles.component';
import { OnOffToogleSwitchComponent } from './shared-components/on-off-toogle-switch/on-off-toogle-switch.component';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ClickOutsideDirective,
    HomeComponent,
    ProjectsComponent,
    AuthorComponent,
    ServerErrorComponent,
    TextInputComponent,
    AppInfoComponent,
    RegisterComponent,
    WelcomeComponent,
    DatePickerComponent,
    SettingsComponent,
    EditProfileComponent,
    CreateNewProjectComponent,
    ProjectsListComponent,
    BackButtonComponent,
    WelcomePageComponent,
    NavGardenOptionsComponent,
    ThemeToogleSwitchComponent,
    ConfirmationComponent,
    EditProjectComponent,
    SlidebarComponent,
    AdminHomePageComponent,
    AllUsersProjectsListComponent,
    SetRolesComponent,
    OnOffToogleSwitchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatDialogModule,
    SharedModule,
    NgbModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
