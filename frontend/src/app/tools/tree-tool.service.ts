import { Injectable } from '@angular/core';
import { EngineService } from '../services/engine.service';
import { BehaviorSubject } from 'rxjs';
import { Vector3 } from 'three';

@Injectable({
  providedIn: 'root'
})
export class TreeToolService {
  public showToolSource = new BehaviorSubject<boolean>(false);
  public showTool$ = this.showToolSource.asObservable();

  private treePosition: Vector3 | undefined;
  private treeName: string | undefined;
  
  constructor() { }

  public setTreePosition(position: Vector3 | undefined) {
    this.treePosition = position;
  }

  public getTreePosition(): Vector3 | undefined {
    return this.treePosition;
  }
  
  public setTreeName(name: string | undefined) {
    this.treeName = name;
  }

  public getTreeName(): string | undefined {
    return this.treeName;
  }
}