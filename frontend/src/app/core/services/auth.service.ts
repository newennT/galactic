import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';

export interface TokenPayload {
    id_user: number;
    is_admin: boolean;
}
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private router: Router) { }

    login(credentials: any){
        return this.http.post<any>(`${environment.apiUrl}/login`, credentials).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);

            })
        );
    }

    getToken() {
        return localStorage.getItem('token');
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/auth/logout']);
    }

    isLogged(): boolean {
        return !!this.getToken();
    }

    register(credentials: any) {
        return this.http.post<any>(`${environment.apiUrl}/register`, credentials).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
            })
        );
    }

    getPayload(): TokenPayload | null {
        const token = this.getToken();
        if(!token) return null;

        return jwt_decode<TokenPayload>(token);
    }

    isAdmin(): boolean {
        return this.getPayload()?.is_admin ?? false;
    }
}