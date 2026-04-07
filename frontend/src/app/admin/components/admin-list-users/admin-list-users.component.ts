import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { AdminUsersService } from '../../services/admin-users.service';

@Component({
  selector: 'app-admin-list-users',
  templateUrl: './admin-list-users.component.html',
  styleUrls: ['./admin-list-users.component.scss']
})
export class AdminListUsersComponent implements OnInit {
  adminUsers$!: Observable<User[]>;
  users: User[] = [];

  constructor(
    private route: ActivatedRoute,
    private adminUsersService: AdminUsersService
  ) { }

  ngOnInit(): void {
    this.adminUsers$ = this.route.data.pipe(
      map(data => data['adminUsers'])
    );
    this.adminUsers$.subscribe(data => {
      this.users = [...data];
    })
  }

}
