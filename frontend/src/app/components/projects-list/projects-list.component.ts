import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Pagination } from 'src/app/models/pagination';
import { Project } from 'src/app/models/project';
import { ProjectsParams } from 'src/app/models/projectsParams';
import { DateService } from 'src/app/services/date.service';
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
    private dateService: DateService
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

}
