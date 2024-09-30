import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IProject } from '../models/interfaces/i-project';

@Injectable({
  providedIn: 'root'
})
export class ProjectLoaderService {
  private currentProject = new BehaviorSubject<IProject | null>(null);
  private isOpenProjectTab: Subject<boolean> = new Subject();

  constructor() { }

  public setProject(project: IProject | null) {
    this.currentProject.next(project);
  }

  public getCurrentProject(): Observable<IProject | null> {
    return this.currentProject.asObservable();
  }

  public loadOpenProjectTab(isOpenProjectTab: boolean = true) {
    this.isOpenProjectTab.next(isOpenProjectTab);
  }

  public getIsOpenProjectTab(): Observable<any> {
    return this.isOpenProjectTab.asObservable();
  }
}
