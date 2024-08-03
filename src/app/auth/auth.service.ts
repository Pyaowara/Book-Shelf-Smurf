import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginApiUrl = 'http://localhost:8000/login';
  private registerApiUrl = 'http://localhost:8000/register';

  constructor(private http: HttpClient,
              private router: Router) { }

  login(users: { users_username: string, users_password: string }): Observable<string> {
    return this.http.post<{message:string}>(this.loginApiUrl, users).pipe(
      map(response => {
        if (response.message === 'Login successful') {
          this.router.navigate(['booklist/'+users.users_username]);
          return 'Login successful';
        } else {
          return 'Invalid username or password';
        }
      }),
      catchError((error) => {
        return of('Invalid username or password');
      })
    );
  }

  register(users: { users_email: string, users_username: string, users_password: string}): Observable<string> {
    return this.http.post(this.registerApiUrl, users, { responseType: 'text' }).pipe(
      map((response: string) => {
        if (response === 'User registered') {
          this.router.navigate(['login']);
          return 'Register successful';
        } else {
          return 'Register fail';
        }
      }),
      catchError((error) => {
        console.error('Error during registration:', error);
        return of('Register fail');
      })
    );
  }
}
