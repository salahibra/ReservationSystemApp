import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const protectedRoutes: RegExp[] = [/^\/home$/, /^\/profile$/, /^\/add-reservation$/, /^\/edit-reservation\/\d+$/, /^\/admin$/];
  const studentRoutes: RegExp[] = [/^\/home$/, /^\/profile$/, /^\/add-reservation$/, /^\/edit-reservation\/\d+$/];
  const adminRoutes: RegExp[] = [/^\/admin$/];
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const token = sessionStorage.getItem('token');

  if (protectedRoutes.some(route => route.test(state.url))) {
    if (!token) {
      router.navigate(['']);
      return false;
    }
    if (adminRoutes.some(route => route.test(state.url)) && user.role !== 'admin') {
      router.navigate(['']);
      return false;
    }
    if (studentRoutes.some(route => route.test(state.url)) && user.role !== 'student') {
      router.navigate(['']);
      return false;
    }
  }

  return true;
};

