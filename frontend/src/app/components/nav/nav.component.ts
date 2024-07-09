import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EngineService } from 'src/app/services/engine.service';
import { LoginService } from 'src/app/services/login.service';
import { ProjectLoaderService } from 'src/app/services/project-loader.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  model: any = {};
  showDropdownMenu: boolean = false;

  constructor(
    public loginService: LoginService,
    private router: Router,
    private toastr: ToastrService,
    private projectLoaderService: ProjectLoaderService,
    private engineService: EngineService
  ) { }

  public login() {
    this.showDropdownMenu = false;

    this.loginService.login(this.model).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
        this.model = {};
      }
    });
  }

  public logout() {
    this.loginService.logout();
    this.router.navigateByUrl('/');
    this.toggleDropdownMenu();
  }

  public toggleDropdownMenu(): void {
    this.showDropdownMenu = !this.showDropdownMenu;
    this.changeDropdownIcon();
  }

  public clickOutside(): void {
    this.showDropdownMenu = false;
    this.changeDropdownIcon();
  }

  public goToMyProjects(): void {
    this.router.navigateByUrl('/');
    this.toggleDropdownMenu();
    
    this.engineService.dispose();
    this.projectLoaderService.loadOpenProjectTab(true);
    this.projectLoaderService.setProject(null);
  }

  private changeDropdownIcon() {
    const icon: Element | null = document.querySelector(".icon");

    if (icon !== null) {
      if (this.showDropdownMenu) {
        icon.innerHTML = "keyboard_arrow_up";
      }
      else {
        icon.innerHTML = "keyboard_arrow_down";
      }
    }
  }
}
