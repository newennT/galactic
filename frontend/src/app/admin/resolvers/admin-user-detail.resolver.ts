import { ResolveFn } from "@angular/router";
import { User } from "src/app/core/models/user.model";
import { inject } from "@angular/core";
import { AdminUsersService } from "../services/admin-users.service";

export const adminUserDetailResolver: ResolveFn<User> = (route) => {
    const id = Number(route.paramMap.get('id'));
    return inject(AdminUsersService).getUserById(id);
}