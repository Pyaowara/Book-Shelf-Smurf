import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private loginApiUrl = 'http://localhost:8000/login';
  private registerApiUrl = 'http://localhost:8000/register';
  private validateTokenApiUrl = 'http://localhost:8000/validate-token';

  constructor(private http: HttpClient,
              private router: Router,
              private cookieService: CookieService) { }

  public login(users: { user_name: string, user_pass: string }): Observable<string> {
    return this.http.post<{message:string, userToken:string, name_user:string}>(this.loginApiUrl, users).pipe(
      map(response => {
        if (response.message === 'Login successful') {
          this.cookieService.set('userToken', response.userToken, 30, '/');
          this.router.navigate(['booklist/'+ response.name_user]);
          return 'Login successful';
        } else {
          return 'Invalid username or password';
        }
      }),
      catchError((error) => {
        console.error('Error during registration:', error);
        return of('Invalid username or password');
      })
    );
  }

  public register(users: { user_email: string, user_name: string, user_pass: string, user_phone: string}): Observable<string> {
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

  public async validateToken(token:string) {
    try {
      return await lastValueFrom(
        this.http.post<{valid:boolean, name:string}>(this.validateTokenApiUrl, {token})
      );
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
