import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IProject } from '../models/interfaces/i-project';

@Injectable({
  providedIn: 'root'
})
export class ProjectLoaderService {

  // TODO: fix last current project bug
  public get lastCurrentProject(): IProject {
    if (this.currentProject.value == null) {
      throw new Error("No current project set up");
    }
    return this.currentProject.value;
  }

  private currentProject = new BehaviorSubject<IProject | null>(null);
  private isOpenProjectTab: Subject<boolean> = new Subject();
  private openProjectTab: boolean = true;

  constructor() { }

  public setProject(project: IProject | null) {
    this.currentProject.next(project);
  }

  public getCurrentProject(): Observable<IProject | null> {
    return this.currentProject.asObservable();
  }

  public loadOpenProjectTab(isOpenProjectTab: boolean = true) {
    this.isOpenProjectTab.next(isOpenProjectTab);
    this.openProjectTab = isOpenProjectTab;
  }

  public getIsOpenProjectTab(): Observable<any> {
    return this.isOpenProjectTab.asObservable();
  }

  public getOpenProjectTab() {
    return this.openProjectTab;
  }
}
