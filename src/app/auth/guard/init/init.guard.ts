import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const initGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const cookieService = inject(CookieService);

  const token: string = cookieService.get('userToken');

  if (!token) {
    return true;
  }
  try {
    const response = await authService.validateToken(token);
    if (response?.valid) {
      await router.navigate(['booklist']);
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.error(err);
    return true;
  }
};