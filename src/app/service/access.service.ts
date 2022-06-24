import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { OrgSet } from '../components/org/chart/interface/node';
import { CustomResponse } from '../interface/custom-response';
import { LoginForm } from '../interface/login-form';
import { PassedUser } from '../interface/passed-user';

const API = 'http://localhost:8085/api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AccessService {

  data: string = '';
  apiUrl: string = 'http://localhost:8085/api';

  constructor(private http: HttpClient) { }

  orgRoot$ = () => <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.apiUrl}/tools/org_set/root`)
      .pipe(
        tap(),
        catchError(this.handleError)
      );

  orgSet$ = (orgSet: OrgSet) => <Observable<CustomResponse>>
    this.http.post<CustomResponse>(`${this.apiUrl}/tools/org_set/save`, orgSet)
      .pipe(
        tap(),
        catchError(this.handleError)
      );

  changeTitle$ = (orgSet: OrgSet) => <Observable<CustomResponse>>
    this.http.post<CustomResponse>(`${this.apiUrl}/tools/org_set/change_title`, orgSet)
      .pipe(
        tap(),
        catchError(this.handleError)
      );

  users$ = <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.apiUrl}/security/users`)
      .pipe(
        tap(),
        catchError(this.handleError)
      );

  passedUser$ = (login: LoginForm) => <Observable<CustomResponse>>
    this.http.post<CustomResponse>(`${this.apiUrl}/login`, login)
      .pipe(
        tap(),
        catchError(this.handleError)
      );

  isLoggedIn(): string | null {
    return window.sessionStorage.getItem('TOKEN');
  }

  login2(username: string, password: string) {
    if (username !== '' && password !== '') {
      window.sessionStorage.setItem('TOKEN', 'token');
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.get(API + 'login?username=' + username + '&password=' + password, httpOptions);
  }

  logout() {
    window.sessionStorage.removeItem('TOKEN');
  }

  saveToken(token: string): void {
    window.sessionStorage.setItem('TOKEN', token);
  }

  getToken(): string | null {
    return window.sessionStorage.getItem('TOKEN');
  }

  handleError(handleError: any): Observable<never> {
    return throwError('');
  }

}
