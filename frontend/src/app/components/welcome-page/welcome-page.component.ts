import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { HomeDisplayMode } from 'src/app/types/home-display-mode';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent {
  mode: HomeDisplayMode = "home";

  constructor(
    public loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user != null) {
          this.router.navigateByUrl(`/projects`);
        }
      }
    });
  }

  public backToHomeMode() {
    this.mode = "home";
  }

  public setDisplayMode(event: HomeDisplayMode) {
    this.mode = event;
  }
}