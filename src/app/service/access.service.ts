import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { OrgSet } from '../components/org/chart/interface/node';
import { AppRole } from '../interface/app-role';
import { CustomResponse } from '../interface/custom-response';
import { LoginForm } from '../interface/login-form';
import { UserRole } from '../interface/role';

const API = 'http://localhost:8085/api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class AccessService {
  data: string = '';
  apiUrl: string = 'http://localhost:8085/api';

  @Output() orgSet!: OrgSet;
  @Output() role!: AppRole;
  @Output() modalRefChart!: BsModalRef;
  @Output() modalRefRole!: BsModalRef;

  setRole(role: AppRole) {
    this.role = role;
  }

  getRole(): AppRole {
    return this.role;
  }

  setOrgSet(orgSet: OrgSet) {
    this.orgSet = orgSet;
  }

  getOrgSet(): OrgSet {
    return this.orgSet;
  }

  constructor(private http: HttpClient) {}

  orgRoot$ = () =>
    <Observable<CustomResponse>>(
      this.http
        .get<CustomResponse>(`${this.apiUrl}/tools/org_set/root`)
        .pipe(tap(), catchError(this.handleError))
    );

  orgSet$ = (orgSet: OrgSet) =>
    <Observable<CustomResponse>>(
      this.http
        .post<CustomResponse>(`${this.apiUrl}/tools/org_set/save`, orgSet)
        .pipe(tap(), catchError(this.handleError))
    );

  changeTitle$ = (orgSet: OrgSet) =>
    <Observable<CustomResponse>>(
      this.http
        .post<CustomResponse>(
          `${this.apiUrl}/tools/org_set/change_title`,
          orgSet
        )
        .pipe(tap(), catchError(this.handleError))
    );

  users$ = <Observable<CustomResponse>>(
    this.http
      .get<CustomResponse>(`${this.apiUrl}/security/users`)
      .pipe(tap(), catchError(this.handleError))
  );

  roles$ = <Observable<CustomResponse>>(
    this.http
      .get<CustomResponse>(`${this.apiUrl}/security/roles`)
      .pipe(tap(), catchError(this.handleError))
  );

  deleteUserRole$ = (userId: number, roleId: number) =>
    <Observable<CustomResponse>>(
      this.http
        .delete<CustomResponse>(
          `${this.apiUrl}/security/user/roles/delete/${userId}/${roleId}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  addRoleToUser$ = (userId: number, role: UserRole) =>
    <Observable<CustomResponse>>(
      this.http
        .post<CustomResponse>(
          `${this.apiUrl}/security/user/add_role/${userId}`,
          role
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  passedUser$ = (login: LoginForm) =>
    <Observable<CustomResponse>>(
      this.http
        .post<CustomResponse>(`${this.apiUrl}/login`, login)
        .pipe(tap(), catchError(this.handleError))
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
    return this.http.get(
      API + 'login?username=' + username + '&password=' + password,
      httpOptions
    );
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

  closeChartModal() {
    this.modalRefChart.hide();
  }

  closeRoleModal() {
    this.modalRefRole.hide();
  }
}
