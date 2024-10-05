import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateNewProjectComponent } from 'src/app/dialogs/create-new-project/create-new-project.component';
import { ProjectsListComponent } from 'src/app/dialogs/projects-list/projects-list.component';
import { AllUsersProjectsListComponent } from '../all-users-projects-list/all-users-projects-list.component';
import { SetRolesComponent } from '../set-roles/set-roles.component';

@Component({
  selector: 'app-admin-home-page',
  templateUrl: './admin-home-page.component.html',
  styleUrls: ['./admin-home-page.component.scss']
})
export class AdminHomePageComponent {
  private createProjectDialogConfig: MatDialogConfig = {
    disableClose: false,
    hasBackdrop: true,
    panelClass: 'dialog',
    backdropClass: 'dialog-backdrop',
    height: 'fit-content',
    width: '400px'
  };

  private projectsListDialogConfig: MatDialogConfig = {
    disableClose: false,
    hasBackdrop: true,
    panelClass: 'dialog',
    backdropClass: 'dialog-backdrop',
    height: 'fit-content',
    width: '1300px'
  };

  private setRolesDialogConfig: MatDialogConfig = {
    disableClose: false,
    hasBackdrop: true,
    panelClass: 'dialog',
    backdropClass: 'dialog-backdrop',
    height: 'fit-content',
    width: '900px'
  };

  constructor(
    private dialog: MatDialog
  ) { }

  public createProject() {
    this.dialog.open(CreateNewProjectComponent, this.createProjectDialogConfig);
  }

  public openExistingProjects() {
    this.dialog.open(AllUsersProjectsListComponent, this.projectsListDialogConfig);
  }

  public openSetRoles() {
    this.dialog.open(SetRolesComponent, this.setRolesDialogConfig);
  }
}
