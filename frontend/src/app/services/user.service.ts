import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/interfaces/i-user';
import { TranslateService } from '@ngx-translate/core';
import { UserRoleService } from './user-role.service';
import { jwtDecode } from 'jwt-decode';
import { IUserData } from '../models/interfaces/i-user-data';
import { PaginationParams } from '../models/classes/paginationParams';
import { getPaginatedResult, getPaginationHeaders } from '../models/functions/paginationHelper';
import { PaginatedResult } from '../models/classes/paginated-result';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSource = new BehaviorSubject<IUser | null>(null);
  public currentUser$ = this.currentUserSource.asObservable();

  private baseUrl = environment.apiUrl;
  private projectCache = new Map<any, any>();

  constructor(
    private http: HttpClient,
    private translateService: TranslateService,
    private userRoleService: UserRoleService
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

    const token: string = user.token;

    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userRoleService.setUserRole(decodedToken.role);
    }
  }

  public logout() {
    localStorage.removeItem('garden-design-app-user');
    this.currentUserSource.next(null);
    this.translateService.use('en');
    this.userRoleService.setUserRole(undefined);
  }

  public getUserDataForEditProfile(username: string): Observable<{ username: string, dateOfBirth: string }> {
    return this.http.get<{ username: string, dateOfBirth: string }>(this.baseUrl + `login/getUserDataForEditProfile/${username}`);
  }

  public editProfile(userData: { oldUsername: string, newUsername: string, dateOfBirth: string }) {
    return this.http.put(this.baseUrl + 'login/editProfile', userData);
  }

  public changeRole(user: IUserData) {
    return this.http.put(this.baseUrl + 'login/changeRole', user);
  }

  public getUsersList(paginationParams: PaginationParams): Observable<PaginatedResult<IUserData[]>> {
    let params: HttpParams = getPaginationHeaders(paginationParams.pageNumber, paginationParams.pageSize);
    
    return getPaginatedResult<IUserData[]>(this.baseUrl + 'login/getUsersList', params, this.http).pipe(
      map(response => {
        this.projectCache.set(Object.values(paginationParams).join('-'), response);
        return response;
      })
    );
  }
}
