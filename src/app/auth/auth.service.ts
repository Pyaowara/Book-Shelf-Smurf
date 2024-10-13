import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // private loginApiUrl = 'https://books-shelves.vercel.app/login';
  // private registerApiUrl = 'https://books-shelves.vercel.app/register';
  // private validateTokenApiUrl = 'https://books-shelves.vercel.app/validate-token';
  private loginApiUrl = 'https://book-back-lovat.vercel.app/user/login';
  private registerApiUrl = 'https://book-back-lovat.vercel.app/user/register';
  private validateTokenApiUrl = 'https://book-back-lovat.vercel.app/user/validate-token';

  constructor(private http: HttpClient,
              private router: Router,
              private cookieService: CookieService) { }

  public login(users: { user_name: string, user_pass: string }): Observable<string> {
    return this.http.post<{message:string, userToken:string, name_user:string}>(this.loginApiUrl, users).pipe(
      map(response => {
        if (response.message === 'Login successful') {
          this.cookieService.set('userToken', response.userToken, 30, '/');
          this.router.navigate(['booklist']);
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

  public register(users: { user_email: string, user_name: string, user_pass: string, user_phone: string }): Observable<string> {
  return this.http.post(this.registerApiUrl, users, { responseType: 'text' }).pipe(
    map((response: string) => {
      if (response === 'User registered') {
        this.router.navigate(['login']);
        return 'Register successful';
      } else {
        return 'Register fail';
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Error during registration:', error);
      let errorMessage = 'An unknown error occurred';

      try {
        const errorObject = JSON.parse(error.error);
    
        if (errorObject?.message) {
          errorMessage = errorObject.message;
        }
      } catch (e) {
        console.error('Error parsing error.message:', e);
      }
    
      console.error('Extracted error message:', errorMessage);
    
      return of(errorMessage);
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

  public async logout(){
    await this.cookieService.delete('userToken', '/');
    this.router.navigate(['login']);
  }

  public getUserId(): Observable<number | null> {
    const userToken = this.cookieService.get('userToken');
    if (!userToken) {
      return of(null);
    }
  
    return this.http.post<{ userId: number }>('https://book-back-lovat.vercel.app/user/getUserId', { token: userToken }).pipe(
      map(response => response.userId),
      catchError(error => {
        console.error('Error fetching user ID:', error);
        return of(null);
      })
    );
  }

}