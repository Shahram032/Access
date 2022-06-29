import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  noop,
  Observable,
  of,
  startWith,
  tap,
} from 'rxjs';
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
import { OrgSet } from '../org/chart/interface/node';
import { AppRole } from 'src/app/interface/app-role';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  private filterSubject = new BehaviorSubject<number>(0);
  private dataSubject!: BehaviorSubject<CustomResponse>;

  filterStatus$ = this.filterSubject.asObservable();

  modalRef1!: BsModalRef;
  modalRef2!: BsModalRef;
  modalRefChart!: BsModalRef;

  tableMode: TableMode = TableMode.VIEW;
  dtlTblMode: TableMode = TableMode.VIEW;

  public userStatuses = Object.values(UserStatus);
  public userStatusesMapping = UserStatusMapping;

  selectedUser!: AppUser;
  @Input() selectedSet: OrgSet = {};
  selectedRole: AppRole = {};

  newRole: UserRole = {
    id: 0,
    roleName: '',
    priority: 0,
    appRole: {} as AppRole,
    orgSet: this.selectedSet,
    assignDate: {} as Date,
  };

  constructor(
    private service: AccessService,
    private bsModalService: BsModalService,
    public modalService: ModalService
  ) {}

  appState$: Observable<AppState<CustomResponse>> | undefined;

  readonly DataState = DataState;
  readonly UserStatus = UserStatus;
  readonly TableMode = TableMode;

  ngOnInit(): void {
    this.appState$ = this.service.users$.pipe(
      map((response) => {
        if (!this.dataSubject)
          this.dataSubject = new BehaviorSubject<CustomResponse>(response);

        this.dataSubject.next(response);
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  editUser(template: TemplateRef<any>) {
    this.tableMode = TableMode.EDIT;
    this.modalRef1 = this.bsModalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-lg',
    });
  }

  openChart(template: TemplateRef<any>) {
    this.modalService.openModal('chart', template, this.selectedSet);
    this.modalService.onHide.subscribe((chart) => {
      if (chart) {
        this.selectedSet = chart; //this.service.getOrgSet();
        this.newRole.orgSet = this.selectedSet;        
      }
    });
  }

  openRole(template: TemplateRef<any>) {
    this.service.modalRefRole = this.bsModalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-md',
    });
    this.bsModalService.onHide.subscribe(() => {
      this.selectedRole = this.service.getRole();
      this.newRole.appRole = this.selectedRole;
    });
  }

  openPersonModal(template: TemplateRef<any>) {
    if (this.tableMode === TableMode.EDIT) return;
    this.modalRef2 = this.bsModalService.show(template, {
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
    this.filterSubject.next(user.id);
    this.appState$ = this.service.deleteUserRole$(user.id, role.id).pipe(
      map((response) => {
        const index: number = this.dataSubject.value.data.appUsers?.findIndex(
          (u) => u.id === user.id
        )!;
        this.dataSubject.value.data.appUsers![index].userRoles =
          response.data.appUser?.userRoles!;
        this.selectedUser.userRoles = response.data.appUser?.userRoles!;

        this.filterSubject.next(0);
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.dataSubject.value,
      }),
      catchError(() => {
        return of({ dataState: DataState.ERROR_STATE });
      })
    );
  }

  addRoleToUser(userId: number, role: UserRole): void {
    var time = new Date();
    role.assignDate = time;
    this.filterSubject.next(userId);
    this.appState$ = this.service.addRoleToUser$(userId, role).pipe(
      map((response) => {
        const index: number = this.dataSubject.value.data.appUsers?.findIndex(
          (u) => u.id === userId
        )!;
        this.dataSubject.value.data.appUsers![index].userRoles =
          response.data.userRoles!;
        this.selectedUser.userRoles = response.data.userRoles!;

        this.filterSubject.next(0);
        return {
          dataState: DataState.LOADED_STATE,
          appData: this.dataSubject.value,
        };
      }),
      startWith({
        dataState: DataState.LOADED_STATE,
        appData: this.dataSubject.value,
      }),
      catchError(() => {
        return of({ dataState: DataState.ERROR_STATE });
      })
    );
  }

  insertDtl() {
    this.dtlTblMode = TableMode.INSERT;
  }

  canselInsertDtl() {
    this.dtlTblMode = TableMode.VIEW;
  }

  closeUserModal() {
    this.modalService.closeModal('user', this.selectedUser);
  }
}
