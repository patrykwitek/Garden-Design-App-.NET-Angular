import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateNewProjectComponent } from '../create-new-project/create-new-project.component';
import { ProjectService } from 'src/app/services/project.service';

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
    height: 'fit-content',
    width: '400px'
  };

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService
  ) { }

  public createProject() {

    let dialogRef = this.dialog.open(CreateNewProjectComponent, this.createProjectDialogConfig);

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.projectService.createProject(result).subscribe(
          response => { },
          error => {
            console.error('Error creating project', error);
          }
        );
      }
    });
  }

  public openExistingProjects() {

  }
}
