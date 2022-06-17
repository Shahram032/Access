import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, startWith, tap } from 'rxjs';
import { DataState } from 'src/app/enum/data-state.enum';
import { AppState } from 'src/app/interface/app-state';
import { CustomResponse } from 'src/app/interface/custom-response';
import { LoginForm } from 'src/app/interface/login-form';
import { PassedUser } from 'src/app/interface/passed-user';
import { AccessService } from 'src/app/service/access.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private service: AccessService, private router: Router) { }
  appState$: Observable<AppState<CustomResponse>> | undefined;
  response$: CustomResponse | undefined;
  user!: PassedUser;
  observable$!: Observable<any>;
  loginForm: LoginForm = { username: '', password: '' };

  ngOnInit(): void {
    /*
    this.appState$ = this.service.passedUser$(this.loginForm)
      .pipe(
        map(response => {
          return { dataState: DataState.LOADED_STATE, appData: response }
        }),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      );
      */
    if (this.service.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  login(): void {
    this.appState$ = this.service.passedUser$(this.loginForm)
      .pipe(
        map(response => {
          return { dataState: DataState.LOADED_STATE, appData: response }
        }),
        tap(res => {
          this.service.saveToken(res.appData.data.passedUser?.accessToken!);
          window.location.reload();
        }
        ),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError(() => {
          return of({ dataState: DataState.ERROR_STATE })
        })
      );
  }
}