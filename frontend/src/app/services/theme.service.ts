import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = false;

  constructor() { }

  public toggleMode() {
    this.darkMode = !this.darkMode;
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
  }

  public isDarkMode(): boolean {
    return this.darkMode;
  }
}
