import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AccessService {
  
  isLoggedIn(): string | null {
    return window.sessionStorage.getItem('TOKEN');
  }
  
  constructor() {}
  
  login(username: string, password: string) {
    if (username !== '' && password !== '') {
      window.sessionStorage.setItem('TOKEN','token');
    }
  }

  logout() {
    window.sessionStorage.removeItem('TOKEN');
  }

}
