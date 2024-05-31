import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { User } from './models/user';

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
    const user: User = JSON.parse(userString);
    this.loginService.setCurrentUser(user);
  }
}