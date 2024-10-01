import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationComponent } from 'src/app/dialogs/confirmation/confirmation.component';
import { ProjectsParams } from 'src/app/models/classes/projectsParams';
import { IPagination } from 'src/app/models/interfaces/i-pagination';
import { IProject } from 'src/app/models/interfaces/i-project';
import { DateService } from 'src/app/services/date.service';
import { GardenService } from 'src/app/services/garden.service';
import { ProjectLoaderService } from 'src/app/services/project-loader.service';
import { ProjectService } from 'src/app/services/project.service';
import { EditProjectComponent } from '../edit-project/edit-project.component';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {

  projects: IProject[] = [];
  pagination: IPagination | undefined;
  projectsParams: ProjectsParams | undefined;

  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ProjectsListComponent>,
    private projectService: ProjectService,
    private projectLoaderService: ProjectLoaderService,
    private dateService: DateService,
    private gardenService: GardenService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.projectsParams = projectService.getProjectsParams();
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    await this.loadProjects();
    this.isLoading = false;
  }

  public cancel() {
    this.dialogRef.close();
  }

  public async loadProjects() {
    await this.projectService.initializeService();
    this.projectsParams = this.projectService.getProjectsParams();

    if (this.projectsParams) {
      this.projectService.setProjectsParams(this.projectsParams);
      this.projectService.getProjects(this.projectsParams).subscribe({
        next: response => {
          if (response.result && response.pagination) {
            this.projects = response.result;
            this.pagination = response.pagination;

            this.projects.map(project => project.dateCreated = this.dateService.getDateOnly(project.dateCreated));
          }
        }
      });
    }
  }

  public pageChanged(event: any) {
    if (this.projectsParams && this.projectsParams.pageNumber !== event.page) {
      this.projectsParams.pageNumber = event.page;

      this.projectService.setProjectsParams(this.projectsParams);

      this.projectService.getProjects(this.projectsParams).subscribe({
        next: response => {
          if (response.result && response.pagination) {
            this.projects = response.result;
            this.pagination = response.pagination;

            this.projects.map(project => project.dateCreated = this.dateService.getDateOnly(project.dateCreated));
          }
        }
      });
    }
  }

  public openProject(project: IProject) {
    this.projectLoaderService.setProject(project);
    this.gardenService.setCurrentProject(project);
    this.projectLoaderService.loadOpenProjectTab(false);

    this.dialogRef.close();
  }

  public removeProject(id: string) {
    const removeProjectDialogConfig: MatDialogConfig = {
      disableClose: false,
      hasBackdrop: true,
      panelClass: 'dialog',
      backdropClass: 'dialog-backdrop',
      height: 'fit-content',
      width: '500px',
      data: { text: 'DeleteProjectConfirmationText' }
    };

    let dialogRef = this.dialog.open(ConfirmationComponent, removeProjectDialogConfig);

    dialogRef.afterClosed().subscribe(response => {
      if (response.confirmation) {
        const currentProject = this.gardenService.getCurrentProject();

        if (currentProject && currentProject.id === id) {
          this.projectLoaderService.setProject(null);
          this.gardenService.setCurrentProject(undefined);
        }

        this.projectService.removeProject(id).subscribe({
          next: () => {
            this.loadProjects();
          },
          error: error => {
            this.toastr.error('Error removing the project: ', error);
          }
        });
      }
    });
  }

  public editProject(project: IProject) {
    const editProjectDialogConfig: MatDialogConfig = {
      disableClose: false,
      hasBackdrop: true,
      panelClass: 'dialog',
      backdropClass: 'dialog-backdrop',
      height: 'fit-content',
      width: '400px',
      data: { project: project }
    };

    let dialogRef = this.dialog.open(EditProjectComponent, editProjectDialogConfig);

    dialogRef.afterClosed().subscribe(_ => {
      this.loadProjects();
    });
  }
}
