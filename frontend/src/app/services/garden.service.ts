import { Injectable } from '@angular/core';
import { EngineService } from './engine.service';
import { IProject } from '../models/interfaces/i-project';
import { IGround } from '../models/interfaces/i-ground';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GardenService {
  private currentGroundSource = new BehaviorSubject<string | null>(null);
  public currentGround$ = this.currentGroundSource.asObservable();

  private currentProject: IProject | undefined;

  constructor(
    private engineService: EngineService
  ) { }

  public setCurrentProject(project: IProject) {
    this.currentProject = project;
  }

  public initialize3DVisualisation() {
    if (!this.currentProject) {
      return;
    }

    // TODO: change to project ground img
    this.engineService.setGround('festuca rubra'); // note: img
    this.currentGroundSource.next('Festuca rubra'); // note: name

    this.engineService.addTestCube(this.currentProject!.width, this.currentProject!.depth);
    this.engineService.setAnimating(true);
    this.engineService.animate();
  }

  public setGround(ground: IGround) {
    // TODO: backend part

    this.engineService.setGround(ground.img);
    this.currentGroundSource.next(ground.name);
  }
}
