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

  public initialize3DVisualisation() {
    if (!this.currentProject) {
      return;
    }

    // TODO: choosing ground functionality 
    this.engineService.preloadGroundTexture('green grass').then(() => {
      this.engineService.addGrass();
      this.engineService.addTestCube(this.currentProject!.width, this.currentProject!.depth);
      this.engineService.setAnimating(true);
      this.engineService.animate();
    });
  }
}
