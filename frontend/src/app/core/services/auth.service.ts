import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {



    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    login(credentials: any){
        return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
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

    }

    isLogged(): boolean {
        return !!this.getToken();
    }
}