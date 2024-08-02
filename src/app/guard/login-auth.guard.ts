import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const loginAuthGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router);

  let isloggedIn = sessionStorage.getItem('isloggedIn');
  if(isloggedIn == 'false'){
    _router.navigate(['login']);
    alert("Please login, redirecting to login page!!");
    return false;
  }
  return true;

};
