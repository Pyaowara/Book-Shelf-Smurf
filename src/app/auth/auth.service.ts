import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserModel } from '../models/user.model/user.model';
import { UserService } from '../services/user_service/user.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private loginApiUrl = 'http://localhost:8000/login';
  private registerApiUrl = 'http://localhost:8000/register';

  constructor(private http: HttpClient,
              private router: Router,
              private UserService: UserService) { }

  public login(users: { user_name: string, user_pass: string }): Observable<string> {
    return this.http.post<any>(this.loginApiUrl, users).pipe(
      map(response => {
        if (response.message === 'Login successful') {
          const loggedInUser = new UserModel(
            response.userId,
            response.userName,
            response.userPass,
            response.userEmail,
            response.userPermission,
            response.userPhone,
            response.userImage,
            response.userDescriptions
          );
          this.UserService.setUser(loggedInUser);
          this.router.navigate(['booklist/'+users.user_name]);
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
}
