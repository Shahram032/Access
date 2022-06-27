import {
  Component,
  OnInit,
} from '@angular/core';
import { catchError, map, Observable, of, startWith, tap } from 'rxjs';
import { DataState } from 'src/app/enum/data-state.enum';
import { AppRole } from 'src/app/interface/app-role';
import { AppState } from 'src/app/interface/app-state';
import { CustomResponse } from 'src/app/interface/custom-response';
import { AccessService } from 'src/app/service/access.service';

@Component({
  selector: 'role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit {

  constructor(
    private service: AccessService
  ) {}
  appState$: Observable<AppState<CustomResponse>> | undefined;
  readonly DataState = DataState;
  role!: AppRole;

  ngOnInit(): void {
    this.appState$ = this.service.roles$.pipe(
      map((response) => {
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  selectRole() {
    this.service.setRole(this.role);
    console.log(this.service.getRole().roleName);
    this.close();
  }

  setRole (role: AppRole){
    this.role = role;
  }

  close() {
    this.service.closeRoleModal();
  }

}
