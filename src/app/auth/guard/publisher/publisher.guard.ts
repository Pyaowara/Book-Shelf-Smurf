import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../../services/user_service/user.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const publisherGuard: CanActivateFn = async(route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const cookieService = inject(CookieService);

  const token: string = cookieService.get('userToken');

  if (!token) {
    return true;
  }
  try {
    const response = await userService.getData();
    if (response?.user_permission == 'User') {
      await router.navigate(['booklist']);
      alert("You don't have access rights!!");
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};
