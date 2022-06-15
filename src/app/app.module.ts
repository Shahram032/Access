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
  declarations: [AppComponent, HomeComponent, LoginComponent, UserComponent],
  imports: [BrowserModule, AppRoutingModule, TablerIconsModule.pick(icons)],
  providers: [AccessService],
  bootstrap: [AppComponent],
})
export class AppModule {}
