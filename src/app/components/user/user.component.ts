import { Component, OnInit, TemplateRef } from '@angular/core';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/data-state.enum';
import { UserStatus } from 'src/app/enum/user-status';
import { AppState } from 'src/app/interface/app-state';
import { CustomResponse } from 'src/app/interface/custom-response';
import { AccessService } from 'src/app/service/access.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  
  modalRef1!: BsModalRef;
  modalRef2!: BsModalRef;

  constructor(
    private service: AccessService,
    private modalService: BsModalService
  ) {}
  appState$: Observable<AppState<CustomResponse>> | undefined;
  readonly DataState = DataState;
  readonly UserStatus = UserStatus;

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
  }

  openUserModal(template: TemplateRef<any>) {
    this.modalRef1 = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-lg'
    });    
  }

  openPersonModal(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true,
      keyboard: false
    });    
  }  

}
