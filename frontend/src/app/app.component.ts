import { Component, OnInit } from '@angular/core';
import { IUser } from './models/interfaces/i-user';
import { TranslateService } from '@ngx-translate/core';
import { Language } from './models/types/language';
import { take } from 'rxjs';
import { ThemeService } from './services/theme.service';
import { UserRoleService } from './services/user-role.service';
import { jwtDecode } from 'jwt-decode';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private userService: UserService,
    private translateService: TranslateService,
    private themeService: ThemeService,
    private userRoleService: UserRoleService
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
    this.userService.setCurrentUser(user);
    this.translateService.use(user.language);

    const token: string = user.token;

    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userRoleService.setUserRole(decodedToken.role);
    }
  }
}