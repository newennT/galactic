import { Component } from '@angular/core';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  faHouse = faHouse;
  faBars = faBars;

  constructor(public auth: AuthService, private router: Router) { }
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }


}
