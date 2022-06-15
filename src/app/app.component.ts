import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessService } from './service/access.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private service: AccessService,private router: Router) { }

  isLoggedIn$: boolean = false; 

  title = 'Access';

  ngOnInit(): void {
    this.isLoggedIn$ = !! this.service.isLoggedIn();
    if (!this.isLoggedIn$) 
      this.router.navigate(['/login']);
  }

  logout(): void {
    this.service.logout();
    window.location.reload();
    this.router.navigate(['/login']);
  }

}
