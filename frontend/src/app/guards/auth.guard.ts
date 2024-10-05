import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const toastr = inject(ToastrService);
  const router = inject(Router);

  return userService.currentUser$.pipe(
    map(user => {
      if(user) return true;
      else {
        router.navigateByUrl('/');
        toastr.error('Log in to access the content');
        return false;
      }
    })
  );
};
