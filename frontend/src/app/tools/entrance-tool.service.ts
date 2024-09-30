import { Injectable } from '@angular/core';
import { EngineService } from '../services/engine.service';
import { Direction } from '../models/types/direction';
import { GardenService } from '../services/garden.service';

@Injectable({
  providedIn: 'root'
})
export class EntranceToolService {
  public entranceDirection: Direction | undefined;

  constructor(
    private engineService: EngineService,
    private gardenService: GardenService
  ) { }

  public initializeEntranceVisualisation(direction: Direction) {
    const currentProject = this.gardenService.getCurrentProject();
    if (!currentProject) return;
    
    this.entranceDirection = direction;

    let x = 0;
    let y = 0;

    if (direction === 'North') {
      x = 0;
      y = currentProject.depth / 2;
    }
    else if (direction === 'South') {
      x = 0;
      y = -(currentProject.depth / 2);
    }
    else if (direction === 'East') {
      x = -(currentProject.width / 2);
      y = 0;
    }
    else if (direction === 'West') {
      x = currentProject.width / 2;
      y = 0;
    }

    this.engineService.initializeEntranceVisualisation(x, y, direction);
  }

  public clearVisualisation() {
    this.engineService.clearEntranceVisualisation();
    this.entranceDirection = undefined;
  }

  public changeEntranceVisualisationPosition(newEntrancePositionX: number) {
    if (this.entranceDirection) {
      this.engineService.changeEntranceVisualisationPosition(newEntrancePositionX, this.entranceDirection);
    }
  }
}
