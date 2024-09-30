import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { EngineService } from 'src/app/services/engine.service';
import { LoginService } from 'src/app/services/login.service';
import { ProjectLoaderService } from 'src/app/services/project-loader.service';
import { SettingsComponent } from '../../dialogs/settings/settings.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditProfileComponent } from '../../dialogs/edit-profile/edit-profile.component';
import { Direction } from 'src/app/models/types/direction';
import { EntranceToolService } from 'src/app/tools/entrance-tool.service';
import { GardenService } from 'src/app/services/garden.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IProject } from 'src/app/models/interfaces/i-project';
import { IEntrance } from 'src/app/models/interfaces/i-entrance';
import { ConstantHelper } from 'src/app/utils/constant-helper';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  @Input() isOpenProjectTab: boolean = true;

  public model: any = {};
  public showDropdownMenu: boolean = false;

  public isOpenEntranceTool: boolean = false;
  public entrancePositionX: number | undefined;
  public entrancePositionMin: number = ConstantHelper.entranceWidth / 2;
  public entrancePositionMax: number | undefined;

  constructor(
    public loginService: LoginService,
    public themeService: ThemeService,
    private router: Router,
    private projectLoaderService: ProjectLoaderService,
    private engineService: EngineService,
    private dialog: MatDialog,
    private entranceTool: EntranceToolService,
    private gardenService: GardenService,
    private http: HttpClient
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

    this.engineService.dispose();
    this.gardenService.setCurrentProject(undefined);
    this.projectLoaderService.setProject(null);
    this.projectLoaderService.loadOpenProjectTab(true);
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
    this.isOpenEntranceTool = false;
    this.toggleDropdownMenu();

    this.engineService.dispose();
    this.gardenService.setCurrentProject(undefined);
    this.projectLoaderService.setProject(null);
    this.projectLoaderService.loadOpenProjectTab(true);
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

  public receiveEntranceTool(direction: Direction) {
    const currentProject = this.gardenService.getCurrentProject();
    if (!currentProject) return;

    this.isOpenEntranceTool = true;

    if (direction == 'North' || direction == 'South') {
      this.entrancePositionX = currentProject.width / 2;
      this.entrancePositionMax = currentProject.width - (ConstantHelper.entranceWidth / 2);
    }
    else if (direction == 'West' || direction == 'East') {
      this.entrancePositionX = currentProject.depth / 2;
      this.entrancePositionMax = currentProject.depth - (ConstantHelper.entranceWidth / 2);
    }
  }

  public closeEntranceTool() {
    this.isOpenEntranceTool = false;
    this.entrancePositionX = 50;
    this.engineService.resetCameraPosition();
    this.entranceTool.clearVisualisation();
  }

  public onEntrancePositionChange(newValue: number) {
    this.entrancePositionX = newValue;
    this.entranceTool.changeEntranceVisualisationPosition(this.entrancePositionX);
  }

  public applyEntrancePosition() {
    const entranceDirection: Direction | undefined = this.entranceTool.entranceDirection;
    const entrancePosition: number | undefined = this.entrancePositionX;

    if(!entranceDirection || !entrancePosition) return;
    
    const entrance: IEntrance = {
      direction: entranceDirection,
      position: entrancePosition
    };

    const currentProject: IProject | undefined = this.gardenService.getCurrentProject();
    if(!currentProject) return;

    const baseUrl: string = environment.apiUrl;
    
    this.http.put(baseUrl + `solution/setEntrance/${currentProject.id}`, entrance).subscribe(
      _ => { },
      error => {
        console.error('Error setting the entrance: ', error);
      }
    );

    this.engineService.setEntrance(entranceDirection);

    this.isOpenEntranceTool = false;
    this.engineService.resetCameraPosition();
    this.entranceTool.clearVisualisation();
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
