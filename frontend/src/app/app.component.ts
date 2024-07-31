import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { IUser } from './models/interfaces/i-user';
import { TranslateService } from '@ngx-translate/core';
import { Language } from './models/types/language';
import { take } from 'rxjs';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private translateService: TranslateService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    // note: translation
    this.translateService.setDefaultLang('en');

    // note: user
    this.setCurrentUser();

    // note: dark mode
    const isDarkModeString = localStorage.getItem('garden-design-app-dark-mode');
    if (!isDarkModeString) {
      localStorage.setItem('garden-design-app-dark-mode', JSON.stringify(false));
    }
    else {
      const isDarkMode: boolean = JSON.parse(isDarkModeString);
      this.themeService.setMode(isDarkMode);
      this.themeService.refreshPage();
    }
  }

  private setCurrentUser() {
    const userString = localStorage.getItem('garden-design-app-user');

    if (!userString) {
      this.translateService.use('en');
      return;
    }

    const user: IUser = JSON.parse(userString);
    this.loginService.setCurrentUser(user);
    this.translateService.use(user.language);
  }
}