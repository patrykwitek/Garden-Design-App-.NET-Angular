import { Injectable } from '@angular/core';
import { EngineService } from './engine.service';
import { IProject } from '../models/interfaces/i-project';
import { IGround } from '../models/interfaces/i-ground';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GardenService {
  private baseUrl = environment.apiUrl;

  private currentGroundSource = new BehaviorSubject<string | null>(null);
  public currentGround$ = this.currentGroundSource.asObservable();

  private currentProject: IProject | undefined;

  constructor(
    private engineService: EngineService,
    private http: HttpClient
  ) { }

  public setCurrentProject(project: IProject) {
    this.currentProject = project;
  }

  public initialize3DVisualisation() {
    if (!this.currentProject) {
      return;
    }

    this.engineService.setGround(this.currentProject.ground.img);
    this.currentGroundSource.next(this.currentProject.ground.name);

    this.engineService.addFence(this.currentProject!.width, this.currentProject!.depth);
    this.engineService.setAnimating(true);
    this.engineService.animate();
  }

  public getGrounds(): Observable<IGround[]> {
    return this.http.get<IGround[]>(this.baseUrl + 'solution/getGroundList');
  }

  public setGround(ground: IGround) {
    if (this.currentProject) {
      this.http.put(this.baseUrl + `solution/setGround/${this.currentProject.id}`, ground).subscribe(
        _ => {},
        error => {
          console.error('Error setting the ground', error);
        }
      );

      this.engineService.setGround(ground.img);
      this.currentGroundSource.next(ground.name);
    }
  }
}
