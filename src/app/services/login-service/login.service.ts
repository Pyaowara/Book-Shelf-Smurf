import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8000/login';
  constructor(private http: HttpClient,
              private router: Router) { }

  login(users: { users_username: string, users_password: string }): Observable<string> {
    return this.http.post(this.apiUrl, users, { responseType: 'text' }).pipe(
      map((response: string) => {
        if (response === 'Login successful') {
          let route = 'booklist/'+users.users_username;
          this.router.navigate([route]);
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
}