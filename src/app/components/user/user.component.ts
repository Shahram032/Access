import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { AccessService } from 'src/app/service/access.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private service: AccessService) { }

  ngOnInit(): void {
    
  }

}
