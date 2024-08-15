import { Injectable } from '@angular/core';
import { UserModel } from '../../models/user.model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: UserModel | null = null;

  public setUser(user: UserModel): void{
    this.currentUser = user;
  }

  public getUser(): UserModel | null {
    return this.currentUser;
  }

  public clearUser(): void {
    this.currentUser = null;
  }

  public isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}
