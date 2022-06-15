import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  IconCamera,
  IconHeart,
  IconBrandGithub,
  IconEdit,
  IconCirclePlus,
  IconHandStop,
  IconLock,
  IconKey,
  IconMenu2
} from 'angular-tabler-icons/icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';
import { AccessService } from './service/access.service';
import { WorkFlowComponent } from './components/work-flow/work-flow/work-flow.component';
import { RoleComponent } from './components/role/role/role.component';
import { RoleAccessComponent } from './components/role/role-access/role-access.component';
import { ChartComponent } from './components/org/chart/chart.component';
import { InfoComponent } from './components/org/info/info.component';

const icons = {
  IconCamera,
  IconHeart,
  IconBrandGithub,
  IconEdit,
  IconCirclePlus,
  IconHandStop,
  IconLock,
  IconKey,
  IconMenu2
};

@NgModule({
  declarations: [AppComponent, HomeComponent, LoginComponent, UserComponent, WorkFlowComponent, RoleComponent, RoleAccessComponent, ChartComponent, InfoComponent],
  imports: [BrowserModule, AppRoutingModule, TablerIconsModule.pick(icons)],
  providers: [AccessService],
  bootstrap: [AppComponent],
})
export class AppModule {}
