import { Injectable } from '@angular/core';
import { EngineService } from '../services/engine.service';
import { GardenService } from '../services/garden.service';

@Injectable({
  providedIn: 'root'
})
export class PavementToolService {

  constructor(
    private engineService: EngineService
  ) { }

  public initializePavementVisualisation(pavementName: string) {
    this.engineService.initializePavementVisualisation(pavementName);
  }
}
