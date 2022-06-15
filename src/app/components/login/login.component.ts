import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessService } from 'src/app/service/access.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private service: AccessService, private router: Router) {}

  ngOnInit(): void {
    if (this.service.isLoggedIn()) 
      this.router.navigate(['/home']);
  }

  login(): void {
    this.service.login('Admin', '1234');
    window.location.reload();
  }
}
