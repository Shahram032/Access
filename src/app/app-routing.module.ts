import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ChartComponent } from './components/org/chart/chart.component';
import { InfoComponent } from './components/org/info/info.component';
import { RoleAccessComponent } from './components/role/role-access/role-access.component';
import { RoleComponent } from './components/role/role/role.component';
import { UserComponent } from './components/user/user.component';
import { WorkFlowComponent } from './components/work-flow/work-flow/work-flow.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserComponent },
  { path: 'work_flow', component: WorkFlowComponent },
  { path: 'role', component: RoleComponent },
  { path: 'role_access', component: RoleAccessComponent },
  { path: 'org_chart', component: ChartComponent },
  { path: 'org_info', component: InfoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
