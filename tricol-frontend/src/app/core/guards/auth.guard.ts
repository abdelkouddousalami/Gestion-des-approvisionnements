import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getCurrentUser()) {
    return true;
  }

  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as string[];

  const user = authService.getCurrentUser();
  if (!user) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (requiredRoles && !requiredRoles.includes(user.role?.nom || '')) {
    router.navigate(['/403']);
    return false;
  }

  return true;
};

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredPermission = route.data['permission'] as string;

  if (!authService.hasPermission(requiredPermission)) {
    router.navigate(['/403']);
    return false;
  }

  return true;
};
