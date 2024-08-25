import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProjectsParams } from '../models/classes/projectsParams';
import { map, of, take } from 'rxjs';
import { getPaginatedResult, getPaginationHeaders } from '../models/functions/paginationHelper';
import { LoginService } from './login.service';
import { IProject } from '../models/interfaces/i-project';
import { IPagination } from '../models/interfaces/i-pagination';
import { IUser } from '../models/interfaces/i-user';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = environment.apiUrl;

  private projects: IProject[] = [];
  private projectCache = new Map<any, any>();
  private pagination: IPagination | undefined;
  private projectsParams: ProjectsParams | undefined;
  private user: IUser | undefined;

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) {
    this.initializeService();
  }

  public createProject(project: IProject) {
    return this.http.post(this.baseUrl + 'projects/create', project);
  }

  public getProjectsParams() {
    return this.projectsParams;
  }

  public setProjectsParams(projectsParams: ProjectsParams) {
    this.projectsParams = projectsParams;
  }

  public resetProjectsParams() {
    if (this.user) {
      this.projectsParams = new ProjectsParams(this.user);
      return this.projectsParams;
    }

    return;
  }

  public destroySession() {
    this.user = undefined;
    this.projectsParams = undefined;
  }

  public getProjects(projectsParams: ProjectsParams) {
    // TODO: check if optimisation is possible
    // const response = this.projectCache.get(Object.values(projectsParams).join('-'));

    // if (response) {
    //   return of(response);
    // }

    let params: HttpParams = getPaginationHeaders(projectsParams.pageNumber, projectsParams.pageSize);

    params = params.append('username', projectsParams.username);

    return getPaginatedResult<IProject[]>(this.baseUrl + 'projects/getProjects', params, this.http).pipe(
      map(response => {
        this.projectCache.set(Object.values(projectsParams).join('-'), response);
        return response;
      })
    );
  }

  public initializeService() {
    this.loginService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.projectsParams = new ProjectsParams(user);
          this.user = user;
        }
      }
    });
  }
}
