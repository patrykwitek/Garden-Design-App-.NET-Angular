import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { ClickOutsideDirective } from './directives/clickOutside.directive';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from './shared-modules/shared.module';
import { HomeComponent } from './components/home/home.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TestErrorsComponent } from './components/test-errors/test-errors.component';
import { AuthorComponent } from './components/author/author.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from './shared-components/text-input/text-input.component';
import { AppInfoComponent } from './components/app-info/app-info.component';
import { RegisterComponent } from './components/register/register.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ClickOutsideDirective,
    HomeComponent,
    ProjectsComponent,
    TestErrorsComponent,
    AuthorComponent,
    NotFoundComponent,
    ServerErrorComponent,
    TextInputComponent,
    AppInfoComponent,
    RegisterComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
