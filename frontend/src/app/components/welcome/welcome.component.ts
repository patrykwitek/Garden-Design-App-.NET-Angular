import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  @Output() changeMode = new EventEmitter();

  public username: string = '';
  public password: string = '';
  public slidebarImageList: string[] = [
    'welcome-page-slidebar/slidebar-add-entrance.jpg',
    'welcome-page-slidebar/slidebar-city.jpg',
    'welcome-page-slidebar/slidebar-elements.jpg',
    'welcome-page-slidebar/slidebar-night-mode.jpg',
    'welcome-page-slidebar/slidebar-pavements.jpg'
  ];

  constructor(
    private loginService: LoginService
  ) { }

  public login() {
    const loginValues = {
      username: this.username,
      password: this.password
    };

    this.loginService.login(loginValues).subscribe({
      next: () => { },
      error: error => {
        console.error(error);
      }
    });
  }

  public changeHomeMode(mode: string) {
    this.changeMode.emit(mode);
  }
}
