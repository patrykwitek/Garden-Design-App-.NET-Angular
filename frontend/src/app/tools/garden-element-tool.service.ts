import { Injectable } from '@angular/core';
import { EngineService } from '../services/engine.service';
import { BehaviorSubject } from 'rxjs';
import { Vector3 } from 'three';
import { ElementCategory } from '../models/types/element-category';

@Injectable({
  providedIn: 'root'
})
export class GardenElementToolService {
  public showToolSource = new BehaviorSubject<boolean>(false);
  public showTool$ = this.showToolSource.asObservable();

  private elementCategory: ElementCategory | undefined;
  private elementName: string | undefined;
  private elementPosition: Vector3 | undefined;

  constructor() { }

  public setElementCategory(categoryName: ElementCategory | undefined) {
    this.elementCategory = categoryName;
  }

  public getElementCategory(): ElementCategory | undefined {
    return this.elementCategory;
  }

  public setElementPosition(position: Vector3 | undefined) {
    this.elementPosition = position;
  }

  public getElementPosition(): Vector3 | undefined {
    return this.elementPosition;
  }

  public setElementName(name: string | undefined) {
    this.elementName = name;
  }

  public getElementName(): string | undefined {
    return this.elementName;
  }
}