import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { IUser } from 'src/app/models/interfaces/i-user';
import { Language } from 'src/app/models/types/language';
import { ThemeService } from 'src/app/services/theme.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  private baseUrl = environment.apiUrl;
  
  public currentLang: string | undefined;
  public isDarkMode: boolean | undefined;

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    private translateService: TranslateService,
    private themeService: ThemeService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.currentLang = this.translateService.currentLang;
    this.isDarkMode = this.themeService.isDarkMode();
  }

  public cancel() {
    this.dialogRef.close();
  }

  public changeLang(lang: Language) {
    this.currentLang = lang;
    this.translateService.use(lang);

    this.http.put(this.baseUrl + 'language/setLanguage', { language: lang }).subscribe(
      _ => {},
      error => {
        console.error('Error setting the language: ', error);
      }
    );

    const userString = localStorage.getItem('garden-design-app-user');

    if (userString){
      const user: IUser = JSON.parse(userString);
      user.language = lang;
      localStorage.setItem('garden-design-app-user', JSON.stringify(user));
    }
  }

  public toggleTheme() {
    this.themeService.toggleMode();
    this.isDarkMode = !this.isDarkMode;

    localStorage.setItem('garden-design-app-dark-mode', JSON.stringify(this.isDarkMode));
  }
}
