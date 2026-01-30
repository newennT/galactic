import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { confirmEqualValidator } from './validators/confirmEqual.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  loading = false;

  registerForm = this.FormBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],

    email: ['', [Validators.required, Validators.email]],
    confirmEmail: ['', Validators.required],

    password: ['', [Validators.required, Validators.minLength(3)]],
    confirmPassword: ['', Validators.required]
  },
{
      validators: [
        confirmEqualValidator('email', 'confirmEmail'),
        confirmEqualValidator('password', 'confirmPassword')
      ]
    });

  constructor(
    private FormBuilder: FormBuilder,
    private router: Router,
    public auth: AuthService
  ) {}

  onSubmit(){
    if(this.registerForm.invalid) return;

    this.loading = true;

    this.auth.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
      }
    })
  }

  logout() {
    this.auth.logout();
  }

}
