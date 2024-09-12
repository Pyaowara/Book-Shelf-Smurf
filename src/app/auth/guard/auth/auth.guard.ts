import { CanActivateFn } from '@angular/router';
import { inject  } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const cookieService = inject(CookieService);

  const token:string = cookieService.get('userToken');

  return authService.validateToken(token).then(response => {
    if (response?.valid) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  }).catch(err => {
    console.error(err);
    router.navigate(['/login']);
    return false;
  });
};

