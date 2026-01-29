import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  loading = false;

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    public auth: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
   
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;

    this.auth.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  logout() {
  this.auth.logout();
}

}
