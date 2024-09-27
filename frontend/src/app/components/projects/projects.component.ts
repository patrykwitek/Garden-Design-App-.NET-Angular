import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateNewProjectComponent } from '../../dialogs/create-new-project/create-new-project.component';
import { ProjectsListComponent } from '../../dialogs/projects-list/projects-list.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {

  createProjectDialogConfig: MatDialogConfig = {
    disableClose: false,
    hasBackdrop: true,
    panelClass: 'dialog',
    backdropClass: 'dialog-backdrop',
    height: 'fit-content',
    width: '400px'
  };

  projectsListDialogConfig: MatDialogConfig = {
    disableClose: false,
    hasBackdrop: true,
    panelClass: 'dialog',
    backdropClass: 'dialog-backdrop',
    height: 'fit-content',
    width: '1300px'
  };

  constructor(
    private dialog: MatDialog
  ) { }

  public createProject() {
    this.dialog.open(CreateNewProjectComponent, this.createProjectDialogConfig);
  }

  public openExistingProjects() {
    this.dialog.open(ProjectsListComponent, this.projectsListDialogConfig);
  }
}
