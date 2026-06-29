import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = environment.apiUrl + '/api/auth';

    constructor(
        private http: HttpClient
    ) { }

    login(request: any): Observable<any> {

        return this.http.post(
            `${this.apiUrl}/login`,
            request
        );
    }

    saveToken(token: string): void {

        localStorage.setItem(
            'token',
            token
        );
    }

    getToken(): string | null {

        return localStorage.getItem(
            'token'
        );
    }

    logout(): void {

        localStorage.clear();
    }

    getRole(): string {
        return localStorage.getItem('role') || "";
    }

    getUsername(): string | null {
        return localStorage.getItem('username');
    }

    isLoggedIn(): boolean {
        return localStorage.getItem('token') != null;
    }

    isAdmin(): boolean {
        return this.getRole() === 'ADMIN';
    }

    isTeacher(): boolean {
        return this.getRole() === 'TEACHER';
    }   

    isStudent(): boolean {
        return this.getRole() === 'STUDENT';
    }   

    logOut(){
        localStorage.clear();
    }
    
}