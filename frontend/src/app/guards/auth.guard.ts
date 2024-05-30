import { CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const toastr = inject(ToastrService);

  return loginService.currentUser$.pipe(
    map(user => {
      if(user) return true;
      else {
        toastr.error('Log in to access the content');
        return false;
      }
    })
  );
};
