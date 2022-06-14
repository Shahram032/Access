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
} from 'angular-tabler-icons/icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';

const icons = {
  IconCamera,
  IconHeart,
  IconBrandGithub,
  IconEdit,
  IconCirclePlus,
  IconHandStop,
  IconLock,
  IconKey
};

@NgModule({
  declarations: [AppComponent, HomeComponent, LoginComponent, UserComponent],
  imports: [BrowserModule, AppRoutingModule, TablerIconsModule.pick(icons)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
