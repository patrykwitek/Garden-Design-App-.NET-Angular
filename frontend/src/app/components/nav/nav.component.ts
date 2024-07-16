import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EngineService } from 'src/app/services/engine.service';
import { LoginService } from 'src/app/services/login.service';
import { ProjectLoaderService } from 'src/app/services/project-loader.service';
import { ProjectService } from 'src/app/services/project.service';
import { SettingsComponent } from '../settings/settings.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  @Input() isOpenProjectTab: boolean = true;
  
  model: any = {};
  showDropdownMenu: boolean = false;

  constructor(
    public loginService: LoginService,
    private router: Router,
    private toastr: ToastrService,
    private projectLoaderService: ProjectLoaderService,
    private engineService: EngineService,
    private dialog: MatDialog
  ) { }

  public login() {
    this.showDropdownMenu = false;

    this.loginService.login(this.model).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
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

  public goToSettings(): void {
    this.toggleDropdownMenu();

    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      hasBackdrop: true,
      panelClass: 'dialog',
      backdropClass: 'dialog-backdrop',
      height: 'fit-content',
      width: '500px'
    };

    this.dialog.open(SettingsComponent, dialogConfig);
  }

  public goToEditProfile(): void {
    this.toggleDropdownMenu();

    const dialogConfig: MatDialogConfig = {
      disableClose: false,
      hasBackdrop: true,
      panelClass: 'dialog',
      backdropClass: 'dialog-backdrop',
      height: 'fit-content',
      width: '800px'
    };

    this.dialog.open(EditProfileComponent, dialogConfig);
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
