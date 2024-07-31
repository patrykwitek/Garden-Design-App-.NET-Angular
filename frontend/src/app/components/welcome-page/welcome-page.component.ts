import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { Language } from 'src/app/models/types/language';
import { LoginService } from 'src/app/services/login.service';
import { ThemeService } from 'src/app/services/theme.service';
import { HomeDisplayMode } from 'src/app/types/home-display-mode';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent {
  public mode: HomeDisplayMode = "home";
  public currentLang: string | undefined;

  constructor(
    public loginService: LoginService,
    private router: Router,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.loginService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user != null) {
          this.router.navigateByUrl(`/`);
        }
      }
    });

    this.currentLang = this.translateService.currentLang;
  }

  public backToHomeMode() {
    this.mode = "home";
  }

  public setDisplayMode(event: HomeDisplayMode) {
    this.mode = event;
  }

  public changeLang(lang: Language) {
    this.currentLang = lang;
    this.translateService.use(lang);
  }
}