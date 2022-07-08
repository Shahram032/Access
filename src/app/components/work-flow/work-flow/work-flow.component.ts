import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/data-state.enum';
import { TableMode } from 'src/app/enum/table-mode';
import { AppState } from 'src/app/interface/app-state';
import { CustomResponse } from 'src/app/interface/custom-response';
import { SystemEntity } from 'src/app/interface/system-entity';
import { WorkFlow } from 'src/app/interface/work-flow';
import { AccessService } from 'src/app/service/access.service';

@Component({
  selector: 'app-work-flow',
  templateUrl: './work-flow.component.html',
  styleUrls: ['./work-flow.component.scss'],
})
export class WorkFlowComponent implements OnInit {
  
  constructor(private service: AccessService,private router: Router, private activatedRoute: ActivatedRoute) {}
  
  readonly DataState = DataState;
  readonly TableMode = TableMode;

  private dataSubject!: BehaviorSubject<CustomResponse>;
  private filterSubject = new BehaviorSubject<number>(0);
  private isLoading = new BehaviorSubject<boolean>(false);
  public entity: SystemEntity | undefined;

  appState$: Observable<AppState<CustomResponse>> | undefined;
  filterStatus$ = this.filterSubject.asObservable();
  isLoading$ = this.isLoading.asObservable();
  tblMode: TableMode = TableMode.VIEW;

  newWf: WorkFlow = {}

  ngOnInit(): void {
    this.entity = history.state;
    if (!this.entity?.entityName) 
      this.entity = {id: 9, entityName: 'Academy'}
      //this.router.navigateByUrl('/entity');
    console.log(this.entity?.entityName);

    this.appState$ = this.service.workFlows$(this.entity!).pipe(
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

  newWorkFlow() {
    this.tblMode = TableMode.INSERT;
  }

  saveNew(wf: WorkFlow): void {
    
    wf.entity = this.entity;
    this.filterSubject.next(wf.id!);
    this.isLoading.next(true);
    this.appState$ = this.service.saveWorkFlow$(wf).pipe(
      map((response) => {
        this.isLoading.next(false);
        this.dataSubject.next(
          {...response, data: {workFlows: [response.data.workFlow! , ...this.dataSubject.value.data.workFlows!]}}
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

}
