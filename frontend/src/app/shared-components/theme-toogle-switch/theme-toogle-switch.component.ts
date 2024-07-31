import { Component, OnInit } from '@angular/core';
import { EngineService } from 'src/app/services/engine.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-theme-toogle-switch',
  templateUrl: './theme-toogle-switch.component.html',
  styleUrls: ['./theme-toogle-switch.component.scss']
})
export class ThemeToogleSwitchComponent implements OnInit {
  public isDarkMode: boolean | undefined;

  constructor(
    private themeService: ThemeService,
    private engineService: EngineService
  ) { }

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDarkMode();
  }

  public toggleTheme() {
    this.themeService.toggleMode();
    this.isDarkMode = !this.isDarkMode;

    localStorage.setItem('garden-design-app-dark-mode', JSON.stringify(this.isDarkMode));
    this.engineService.addSky();
    this.engineService.setLightSettings();
  }
}
