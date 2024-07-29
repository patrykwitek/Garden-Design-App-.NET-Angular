import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public currentLang: string | undefined;
  public isDarkMode: boolean | undefined;

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    private translateService: TranslateService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.currentLang = this.translateService.currentLang;
  }

  public cancel() {
    this.dialogRef.close();
  }

  public changeLang(lang: string) {
    this.currentLang = lang;
    this.translateService.use(lang);
    localStorage.setItem('garden-design-app-language', JSON.stringify(lang));
  }

  public toggleTheme() {
    this.themeService.toggleMode();
    this.isDarkMode = !this.isDarkMode;

    localStorage.setItem('garden-design-app-dark-mode', JSON.stringify(this.isDarkMode));
  }
}
