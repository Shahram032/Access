import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { catchError, map, Observable, of, startWith, tap } from 'rxjs';
import { DataState } from 'src/app/enum/data-state.enum';
import { UserStatus, UserStatusMapping } from 'src/app/enum/user-status';
import { AppState } from 'src/app/interface/app-state';
import { CustomResponse } from 'src/app/interface/custom-response';
import { AccessService } from 'src/app/service/access.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AppUser } from 'src/app/interface/user';
import { TableMode } from 'src/app/enum/table-mode';
import { UserRole } from 'src/app/interface/role';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  modalRef1!: BsModalRef;
  modalRef2!: BsModalRef;

  tableMode: TableMode = TableMode.VIEW;

  public userStatuses = Object.values(UserStatus);
  public userStatusesMapping = UserStatusMapping;

  selectedUser!: AppUser;

  constructor(
    private service: AccessService,
    private modalService: BsModalService
  ) {}
  appState$: Observable<AppState<CustomResponse>> | undefined;
  userRolesState$: Observable<AppState<CustomResponse>> | undefined;
  readonly DataState = DataState;
  readonly UserStatus = UserStatus;
  readonly TableMode = TableMode;

  ngOnInit(): void {
    this.appState$ = this.service.users$.pipe(
      map((response) => {
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
    this.userRolesState$ = this.appState$;
  }

  editUser(template: TemplateRef<any>) {
    this.tableMode = TableMode.EDIT;
    this.modalRef1 = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-lg',
    });
  }

  openPersonModal(template: TemplateRef<any>) {
    if (this.tableMode === TableMode.EDIT) return;
    this.modalRef2 = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true,
      keyboard: false,
    });
  }

  selectUser(user: AppUser) {
    this.selectedUser = user;
    //this.selectedUser.password = '****';
  }

  deleteUserRole(user: AppUser, role: UserRole): void {
    this.userRolesState$ = this.service.deleteUserRole$(user.id, role.id).pipe(
      map((response) => {
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      tap((res) => {
        this.selectedUser.userRoles = res.appData.data.userRoles!;
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError(() => {
        return of({ dataState: DataState.ERROR_STATE });
      })
    );
  }
}
