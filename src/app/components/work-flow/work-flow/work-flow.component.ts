import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from 'src/app/enum/data-state.enum';
import { AppState } from 'src/app/interface/app-state';
import { CustomResponse } from 'src/app/interface/custom-response';
import { SystemEntity } from 'src/app/interface/system-entity';
import { AccessService } from 'src/app/service/access.service';

@Component({
  selector: 'app-work-flow',
  templateUrl: './work-flow.component.html',
  styleUrls: ['./work-flow.component.scss'],
})
export class WorkFlowComponent implements OnInit {
  
  constructor(private service: AccessService,private router: Router, private activatedRoute: ActivatedRoute) {}
  appState$: Observable<AppState<CustomResponse>> | undefined;
  readonly DataState = DataState;

  entity: SystemEntity | undefined;

  ngOnInit(): void {
    this.entity = history.state;
    if (!this.entity?.entityName) this.router.navigateByUrl('/entity');
    console.log(this.entity?.entityName);

    this.appState$ = this.service.workFlows$(this.entity!).pipe(
      map((response) => {
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );    
  }
}
