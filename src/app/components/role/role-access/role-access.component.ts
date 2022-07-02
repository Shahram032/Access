import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/data-state.enum';
import { AppState } from 'src/app/interface/app-state';
import { CustomResponse } from 'src/app/interface/custom-response';
import { AccessService } from 'src/app/service/access.service';

@Component({
  selector: 'app-role-access',
  templateUrl: './role-access.component.html',
  styleUrls: ['./role-access.component.scss']
})
export class RoleAccessComponent implements OnInit {

  readonly DataState = DataState;
  appState$: Observable<AppState<CustomResponse>> | undefined;

  constructor(private service: AccessService) { }

  ngOnInit(): void {
    this.appState$ = this.service.roleAccesses$.pipe(
      map((response) => {
        //if (!this.dataSubject)
          //this.dataSubject = new BehaviorSubject<CustomResponse>(response);

        //this.dataSubject.next(response);
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

}
