import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/interfaces/i-user';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient,
    private translateService: TranslateService
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
    localStorage.setItem('garden-design-app-user', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.translateService.use(user.language);
  }

  public logout() {
    localStorage.removeItem('garden-design-app-user');
    this.currentUserSource.next(null);
    this.translateService.use('en');
  }
}
