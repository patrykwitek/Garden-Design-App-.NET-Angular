import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  // note: guardy dodajemy w app routing module
  const loginService = inject(LoginService);
  const toastr = inject(ToastrService);
  const router = inject(Router);
  
  return loginService.currentUser$.pipe(
    map(user => {
      if (!user) {
        return false;
      }

      if (user.role == 'admin') {
        return true;
      }
      else {
        router.navigateByUrl('/');
        toastr.error("You cannot enter this content if you are not an admin");
        return false;
      }
    })
  );
};
