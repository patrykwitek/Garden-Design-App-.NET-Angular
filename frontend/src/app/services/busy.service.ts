import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ThemeService } from './theme.service';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount: number = 0;

  constructor(
    private spinnerService: NgxSpinnerService,
    private themeService: ThemeService
  ) { }

  public busy() {
    this.busyRequestCount++;

    if (this.themeService.isDarkMode()) {
      this.spinnerService.show(undefined, {
        type: 'line-spin-fade',
        bdColor: 'rbga(255,255,255,0)',
        color: 'rgb(255,255,255)'
      });
    }
    else {
      this.spinnerService.show(undefined, {
        type: 'line-spin-fade',
        bdColor: 'rbga(255,255,255,0)',
        color: 'rgb(28, 61, 32)'
      });
    }

  }

  public idle() {
    this.busyRequestCount--;

    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
