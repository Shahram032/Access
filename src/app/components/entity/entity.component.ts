import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/data-state.enum';
import { AppState } from 'src/app/interface/app-state';
import { CustomResponse } from 'src/app/interface/custom-response';
import { SystemEntity } from 'src/app/interface/system-entity';
import { AccessService } from 'src/app/service/access.service';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss']
})
export class EntityComponent implements OnInit {

  constructor(private service: AccessService,private modalService: ModalService) { }

  appState$: Observable<AppState<CustomResponse>> | undefined;
  readonly DataState = DataState;
  entity!: SystemEntity;  

  ngOnInit(): void {
    this.appState$ = this.service.entities$.pipe(
      map((response) => {
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  selectEntity() {
    this.modalService.closeModal('entity', this.entity);
  }

  setEntity (entity: SystemEntity){
    this.entity = entity;
  }

  closeEntityModal() {
    this.modalService.closeModal('','');
  }

}
