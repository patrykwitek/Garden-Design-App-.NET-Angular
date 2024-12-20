import { Injectable } from '@angular/core';
import { EngineService } from './engine.service';
import { IProject } from '../models/interfaces/i-project';
import { IGround } from '../models/interfaces/i-ground';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { IFence } from '../models/interfaces/i-fence';
import { IElementCategory } from '../models/interfaces/i-element-category';
import { IElement } from '../models/interfaces/i-element';
import { IEnvironment } from '../models/interfaces/i-environment';
import { Environment } from '../models/types/environment';

@Injectable({
  providedIn: 'root'
})
export class GardenService {
  private baseUrl = environment.apiUrl;

  private currentGroundSource = new BehaviorSubject<string | null>(null);
  public currentGround$ = this.currentGroundSource.asObservable();

  private currentEnvironmentSource = new BehaviorSubject<Environment | null>(null);
  public currentEnvironment$ = this.currentEnvironmentSource.asObservable();

  private currentFenceSource = new BehaviorSubject<string | null>(null);
  public currentFence$ = this.currentFenceSource.asObservable();

  private currentProject: IProject | undefined;

  constructor(
    private engineService: EngineService,
    private http: HttpClient
  ) { }

  public setCurrentProject(project: IProject | undefined) {
    this.currentProject = project;
  }

  public getCurrentProject(): IProject | undefined {
    return this.currentProject;
  }

  public initialize3DVisualisation() {
    if (!this.currentProject) {
      return;
    }

    this.engineService.setGardenDimensions(this.currentProject.width, this.currentProject.depth);
    this.engineService.setCurrentProject(this.currentProject.id);
    this.engineService.resetCameraPosition();

    this.engineService.setGround(this.currentProject.ground.img);
    this.currentGroundSource.next(this.currentProject.ground.name);

    this.engineService.setEnvironment(this.currentProject.environment.name);
    this.currentEnvironmentSource.next(this.currentProject.environment.name);

    this.engineService.setFence(this.currentProject.fence.name.toLowerCase());
    this.currentFenceSource.next(this.currentProject.fence.name);

    this.engineService.setGardenElements();

    this.engineService.setAnimating(true);
    this.engineService.animate();
  }

  public getGrounds(): Observable<IGround[]> {
    return this.http.get<IGround[]>(this.baseUrl + 'solution/getGroundList');
  }

  public getEnvironments(): Observable<IEnvironment[]> {
    return this.http.get<IEnvironment[]>(this.baseUrl + 'solution/getEnvironmentList');
  }

  public getFences(): Observable<IFence[]> {
    return this.http.get<IFence[]>(this.baseUrl + 'solution/getFenceList');
  }

  public getElementCategories(): Observable<IElementCategory[]> {
    return this.http.get<IElementCategory[]>(this.baseUrl + 'solution/getElementCategoriesList');
  }

  public getElementsByCategory(category: string): Observable<IElement[]> {
    return this.http.get<IElement[]>(this.baseUrl + 'solution/getElementsListByCategory/' + category);
  }

  public setGround(ground: IGround) {
    if (this.currentProject) {
      this.http.put(this.baseUrl + `solution/setGround/${this.currentProject.id}`, ground).subscribe(
        _ => { },
        error => {
          console.error('Error setting the ground: ', error);
        }
      );

      this.engineService.setGround(ground.img);
      this.currentGroundSource.next(ground.name);
    }
  }

  public setEnvironment(environment: IEnvironment) {
    if (this.currentProject) {
      this.http.put(this.baseUrl + `solution/setEnvironment/${this.currentProject.id}`, environment).subscribe(
        _ => {
          this.currentProject!.environment = environment;
        },
        error => {
          console.error('Error setting the environment: ', error);
        }
      );

      this.engineService.setEnvironment(environment.name);
      this.currentEnvironmentSource.next(environment.name);
    }
  }

  public setFence(fence: IFence) {
    if (this.currentProject) {
      this.http.put(this.baseUrl + `solution/setFence/${this.currentProject.id}`, fence).subscribe(
        _ => { },
        error => {
          console.error('Error setting the fence: ', error);
        }
      );

      this.engineService.setFence(fence.name.toLowerCase());
      this.currentFenceSource.next(fence.name);
    }
  }
}
