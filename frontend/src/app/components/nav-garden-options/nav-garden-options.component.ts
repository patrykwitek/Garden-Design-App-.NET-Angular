import { Component } from '@angular/core';
import { EngineService } from 'src/app/services/engine.service';

@Component({
  selector: 'app-nav-garden-options',
  templateUrl: './nav-garden-options.component.html',
  styleUrls: ['./nav-garden-options.component.scss']
})
export class NavGardenOptionsComponent {

  constructor(
    private engineService: EngineService
  ) { }

  public resetCameraPosition() {
    this.engineService.resetCameraPosition();
  }
}
