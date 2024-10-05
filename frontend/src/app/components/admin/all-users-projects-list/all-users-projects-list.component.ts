import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationComponent } from 'src/app/dialogs/confirmation/confirmation.component';
import { EditProjectComponent } from 'src/app/dialogs/edit-project/edit-project.component';
import { PaginationParams } from 'src/app/models/classes/paginationParams';
import { IPagination } from 'src/app/models/interfaces/i-pagination';
import { IProject } from 'src/app/models/interfaces/i-project';
import { DateService } from 'src/app/services/date.service';
import { GardenService } from 'src/app/services/garden.service';
import { ProjectLoaderService } from 'src/app/services/project-loader.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-all-users-projects-list',
  templateUrl: './all-users-projects-list.component.html',
  styleUrls: ['./all-users-projects-list.component.scss']
})
export class AllUsersProjectsListComponent implements OnInit {
  public projects: IProject[] = [];
  public pagination: IPagination | undefined;
  public isLoading: boolean = false;

  private projectsParams: PaginationParams | undefined;

  constructor(
    public dialogRef: MatDialogRef<AllUsersProjectsListComponent>,
    private projectService: ProjectService,
    private projectLoaderService: ProjectLoaderService,
    private dateService: DateService,
    private gardenService: GardenService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    await this.loadProjects();
    this.isLoading = false;
  }

  public cancel() {
    this.dialogRef.close();
  }

  public async loadProjects() {
    this.projectsParams = new PaginationParams();
    this.projectService.getAllUsersProjects(this.projectsParams).subscribe({
      next: response => {
        if (response.result && response.pagination) {
          this.projects = response.result;
          this.pagination = response.pagination;

          this.projects.map(project => project.dateCreated = this.dateService.getDateOnly(project.dateCreated));
        }
      }
    });
  }

  public pageChanged(event: any) {
    if (this.projectsParams && this.projectsParams.pageNumber !== event.page) {
      this.projectsParams.pageNumber = event.page;

      this.projectService.getAllUsersProjects(this.projectsParams).subscribe({
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
