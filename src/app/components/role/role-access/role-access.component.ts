import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { DataState } from 'src/app/enum/data-state.enum';
import { TableMode } from 'src/app/enum/table-mode';
import { AppState } from 'src/app/interface/app-state';
import { CustomResponse } from 'src/app/interface/custom-response';
import { RoleAccess } from 'src/app/interface/role-access';
import { SystemEntity } from 'src/app/interface/system-entity';
import { AccessService } from 'src/app/service/access.service';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-role-access',
  templateUrl: './role-access.component.html',
  styleUrls: ['./role-access.component.scss'],
})
export class RoleAccessComponent implements OnInit {
  readonly DataState = DataState;
  appState$: Observable<AppState<CustomResponse>> | undefined;
  private dataSubject!: BehaviorSubject<CustomResponse>;
  private filterSubject = new BehaviorSubject<number>(0);
  filterStatus$ = this.filterSubject.asObservable();
  private editSubject = new BehaviorSubject<number>(0);
  editStatus$ = this.editSubject.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  @Input() selectedEntity: SystemEntity = {};

  newRa: RoleAccess = {
    name: '',
    entity: {
      id: 0,
      entityName: '',
      fullName: '',
      systemName: '',
      systemFields: [],
    },
    allowInsert: false,
    allowEdit: false,
    allowDelete: false,
    readAll: false,
    writeAll: false,
    readOwner: false,
    writeOwner: false,
    readSet: false,
    writeSet: false,
    setReadDeep: 0,
    setWriteDeep: 0,
    deniedViewList: [],
    deniedEditList: [],
  };

  tblMode: TableMode = TableMode.VIEW;
  readonly TableMode = TableMode;

  constructor(
    private service: AccessService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.appState$ = this.service.roleAccesses$.pipe(
      map((response) => {
        if (!this.dataSubject)
          this.dataSubject = new BehaviorSubject<CustomResponse>(response);
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  saveChanges(ra: RoleAccess): void {
    this.filterSubject.next(ra.id!);
    this.isLoading.next(true);
    this.appState$ = this.service.saveRoleAccess$(ra).pipe(
      map((response) => {
        const index: number = this.dataSubject.value.data.appUsers?.findIndex(
          (r) => r.id === ra.id
        )!;
        this.isLoading.next(false);
        this.dataSubject.value.data.roleAccesses![index] =
          response.data.roleAccess!;

        this.filterSubject.next(0);
        this.tblMode = TableMode.VIEW;
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
        this.isLoading.next(false);
        this.filterSubject.next(0);
        return of({ dataState: DataState.ERROR_STATE });
      })
    );
  }

  saveNew(ra: RoleAccess): void {
    this.filterSubject.next(ra.id!);
    this.isLoading.next(true);
    this.appState$ = this.service.saveRoleAccess$(ra).pipe(
      map((response) => {
        this.isLoading.next(false);
        this.dataSubject.next(
          {...response, data: {roleAccesses: [response.data.roleAccess! , ...this.dataSubject.value.data.roleAccesses!]}}
        );

        this.filterSubject.next(0);
        this.tblMode = TableMode.VIEW;
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
        this.isLoading.next(false);
        this.filterSubject.next(0);
        return of({ dataState: DataState.ERROR_STATE });
      })
    );
  }

  editRoleAccess(i: number) {
    this.editSubject.next(i);
  }

  newRoleAccess() {
    this.tblMode = TableMode.INSERT;
  }

  openEntity(template: TemplateRef<any>) {
    this.modalService.openModal('entity', template, this.selectedEntity);
    this.modalService.onHide.subscribe((entity) => {
      if (entity) {
        this.newRa.entity = entity;
      }
    });
  }
}
