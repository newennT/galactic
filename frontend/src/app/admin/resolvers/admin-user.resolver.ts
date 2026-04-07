import { ResolveFn } from "@angular/router";
import { User } from "src/app/core/models/user.model";
import { inject } from "@angular/core";
import { AdminUsersService } from "../services/admin-users.service";

export const adminUsersResolver: ResolveFn<User[]> = () => {
    const adminUsersService = inject(AdminUsersService);
    return adminUsersService.getUsers();
}