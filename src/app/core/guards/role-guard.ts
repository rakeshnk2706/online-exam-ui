import { inject } from '@angular/core';

import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);

    return false;
  }

  const allowedRoles = route.data['roles'] as string[] | undefined;

  // No roles specified = any authenticated user
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  if (!allowedRoles.includes(auth.getRole())) {
    router.navigate(['/unauthorized']);

    return false;
  }

  return true;
};
