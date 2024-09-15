import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = false;
  private isDarkModeSource = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkModeSource.asObservable();

  constructor() { }

  public toggleMode() {
    this.darkMode = !this.darkMode;
    this.isDarkModeSource.next(this.darkMode);
    this.refreshPage();
  }

  public refreshPage() {
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  public setMode(isDarkMode: boolean) {
    this.darkMode = isDarkMode;
    this.isDarkModeSource.next(isDarkMode);
  }

  public isDarkMode(): boolean {
    return this.darkMode;
  }
}
