import { Component, Input } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-list-users-item',
  templateUrl: './admin-list-users-item.component.html',
  styleUrls: ['./admin-list-users-item.component.scss']
})
export class AdminListUsersItemComponent implements OnInit {
  @Input() adminUser!: User;

  ngOnInit(): void {
    
  }

}
