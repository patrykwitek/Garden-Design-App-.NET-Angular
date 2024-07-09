import { Injectable } from '@angular/core';
import { Project } from '../models/interfaces/project';
import { EngineService } from './engine.service';

@Injectable({
  providedIn: 'root'
})
export class GardenService {
  private currentProject: Project | undefined;

  constructor(
    private engineService: EngineService
  ) { }

  public setCurrentProject(project: Project) {
    this.currentProject = project;
  }

  public addTestCubes(): void {
    if (this.currentProject) {
      this.engineService.addTestCubes(this.currentProject?.width);
    }
  }
}
