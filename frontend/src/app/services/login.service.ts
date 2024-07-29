import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/interfaces/i-user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  public login(model: any) {
    return this.http.post<IUser>(this.baseUrl + 'login/login', model).pipe(
      map((response: IUser) => {
        const user = response;

        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  public register(model: any) {
    return this.http.post<IUser>(this.baseUrl + 'login/register', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  public setCurrentUser(user: IUser) {
    localStorage.setItem('gardenDesignAppUser', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  public logout() {
    localStorage.removeItem('gardenDesignAppUser');
    this.currentUserSource.next(null);
  }
}
