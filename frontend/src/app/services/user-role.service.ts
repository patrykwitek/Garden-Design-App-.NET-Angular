import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Role } from '../models/types/role';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  private userRole: Subject<Role | undefined> = new Subject();

  constructor() { }

  public setUserRole(userRole: Role | undefined) {
    this.userRole.next(userRole);
  }

  public getUserRole(): Observable<Role | undefined> {
    return this.userRole.asObservable();
  }
}
