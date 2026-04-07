import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "src/app/core/models/user.model";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class AdminUsersService {
    constructor(private http: HttpClient) {}

    getUsers(): Observable<User[]> {
        return this.http
        .get<{ message: String; data: User[] }>(`${environment.apiUrl}/users`)
        .pipe(map(res => res.data));
    }

    getUserById(id: number): Observable<User> {
        return this.http
        .get<{ message: String; data: User }>(`${environment.apiUrl}/users/${id}`)
        .pipe(map(res => res.data));
    }

    updateUser(id: number, user: any): Observable<User> {
        return this.http.put<{ message: string, data: User }>(
            `${environment.apiUrl}/users/${id}`,
            user
        )
        .pipe(map(res => res.data));
    }

    createUser(payload: any): Observable<User> {
        return this.http.post<{ message: string, data: User }>(
            `${environment.apiUrl}/users`,
            payload
        )
        .pipe(map(res => res.data));
    }
}