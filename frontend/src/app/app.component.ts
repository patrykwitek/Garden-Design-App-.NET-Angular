import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { IUser } from './models/interfaces/i-user';
import { TranslateService } from '@ngx-translate/core';
import { Language } from './models/types/language';

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
    // note: user
    this.setCurrentUser();

    // note: translation
    // TODO: get translation from db, not localStorage
    this.translateService.setDefaultLang('en');

    const languageString = localStorage.getItem('garden-design-app-language');
    if (!languageString) {
      this.translateService.use('en');
    }
    else {
      const language: Language = JSON.parse(languageString);
      this.translateService.use(language);
    }

    // note: dark mode
    // TODO
  }

  setCurrentUser() {
    const userString = localStorage.getItem('gardenDesignAppUser');
    if (!userString) return;
    const user: IUser = JSON.parse(userString);
    this.loginService.setCurrentUser(user);
  }
}