import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  mode: HomeDisplayMode = "home";

  constructor(
    private loginService: LoginService,
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

type HomeDisplayMode = "home" | "register" | "author" | "app";