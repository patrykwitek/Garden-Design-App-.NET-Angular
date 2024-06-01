import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  public createProject(project: Project) {
    return this.http.post(this.baseUrl + 'projects/create', project);
  }
}
