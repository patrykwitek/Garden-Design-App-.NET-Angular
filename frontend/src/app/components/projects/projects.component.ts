import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateNewProjectComponent } from '../../dialogs/create-new-project/create-new-project.component';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectsListComponent } from '../../dialogs/projects-list/projects-list.component';
import { ToastrService } from 'ngx-toastr';

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
    width: '500px'
  };

  projectsListDialogConfig: MatDialogConfig = {
    disableClose: false,
    hasBackdrop: true,
    panelClass: 'dialog',
    backdropClass: 'dialog-backdrop',
    height: 'fit-content',
    width: '900px'
  };

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private toastr: ToastrService
  ) { }

  public createProject() {
    let dialogRef = this.dialog.open(CreateNewProjectComponent, this.createProjectDialogConfig);

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.projectService.createProject(result).subscribe(
          response => {
            this.toastr.success('New project successfully added');
          },
          error => {
            this.toastr.error('Error creating project', error);
          }
        );
      }
    });
  }

  public openExistingProjects() {
    this.dialog.open(ProjectsListComponent, this.projectsListDialogConfig);
  }
}
