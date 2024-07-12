import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { IUser } from './models/interfaces/i-user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('parkDesignAppUser');
    if (!userString) return;
    const user: IUser = JSON.parse(userString);
    this.loginService.setCurrentUser(user);
  }
}