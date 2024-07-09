import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectsParams } from 'src/app/models/classes/projectsParams';
import { Pagination } from 'src/app/models/interfaces/pagination';
import { Project } from 'src/app/models/interfaces/project';
import { DateService } from 'src/app/services/date.service';
import { EngineService } from 'src/app/services/engine.service';
import { GardenService } from 'src/app/services/garden.service';
import { ProjectLoaderService } from 'src/app/services/project-loader.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {

  projects: Project[] = [];
  pagination: Pagination | undefined;
  projectsParams: ProjectsParams | undefined;

  constructor(
    public dialogRef: MatDialogRef<ProjectsListComponent>,
    private projectService: ProjectService,
    private projectLoaderService: ProjectLoaderService,
    private dateService: DateService,
    private gardenService: GardenService,
    private engineService: EngineService
  ) {
    this.projectsParams = projectService.getProjectsParams();
  }

  ngOnInit(): void {
    this.loadProjects();
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

  public openProject(project: Project) {
    this.projectLoaderService.setProject(project);
    this.gardenService.setCurrentProject(project);
    this.projectLoaderService.loadOpenProjectTab(false);

    this.dialogRef.close();
  }

}
