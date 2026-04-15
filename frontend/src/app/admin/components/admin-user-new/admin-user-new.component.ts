import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminUsersService } from '../../services/admin-users.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-new',
  templateUrl: './admin-user-new.component.html',
  styleUrls: ['./admin-user-new.component.scss']
})
export class AdminUserNewComponent implements OnInit {
  isEditMode = false;
  userId!: number;

  userForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    is_admin: [false]
  })

  constructor(
    private formBuilder: FormBuilder,
    private adminUsersService: AdminUsersService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];

    if (this.userId){
      this.isEditMode = true;
      this.loadUser();
    }
  }

  loadUser(): void{
    this.adminUsersService.getUserById(this.userId).subscribe(user => {
      this.userForm.patchValue({
        username: user.username,
        email: user.email,
        is_admin: user.is_admin
      });

      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    const data = this.userForm.value;

    if (this.isEditMode){
      this.adminUsersService.updateUser(this.userId, data).subscribe(() => {
        this.router.navigate(['/admin/users']);
      });
    } else {
      this.adminUsersService.createUser(data).subscribe(() => {
        this.router.navigate(['/admin/users']);
      });
    }
  }

}
