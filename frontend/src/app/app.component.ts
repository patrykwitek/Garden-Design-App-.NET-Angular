import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { IUser } from './models/interfaces/i-user';
import { TranslateService } from '@ngx-translate/core';
import { Language } from './models/types/language';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    // note: translation
    this.translateService.setDefaultLang('en');

    // note: user
    this.setCurrentUser();

    // note: dark mode
    // TODO
  }

  private setCurrentUser() {
    const userString = localStorage.getItem('garden-design-app-user');

    if (!userString){
      this.translateService.use('en');
      return;
    }

    const user: IUser = JSON.parse(userString);
    this.loginService.setCurrentUser(user);
    this.translateService.use(user.language);
  }
}