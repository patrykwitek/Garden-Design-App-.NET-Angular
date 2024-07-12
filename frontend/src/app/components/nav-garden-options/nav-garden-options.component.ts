import { Component, OnInit } from '@angular/core';
import { IGround } from 'src/app/models/interfaces/i-ground';
import { EngineService } from 'src/app/services/engine.service';
import { GardenService } from 'src/app/services/garden.service';

@Component({
  selector: 'app-nav-garden-options',
  templateUrl: './nav-garden-options.component.html',
  styleUrls: ['./nav-garden-options.component.scss']
})
export class NavGardenOptionsComponent implements OnInit {

  // note: ground textures from https://pl.freepik.com
  // https://pl.freepik.com/darmowe-wektory/wzor-bez-szwu-zielonej-trawie_13187581.htm#fromView=search&page=1&position=2&uuid=f90cebc8-5133-4d24-8e09-284ece62e73a
  // https://www.freepik.com/free-vector/green-grass-vector-seamless-texture-lawn-nature-meadow-plant-field-natural-outdoor-illustration_11059458.htm#page=8&query=grass%20texture&position=21&from_view=keyword&track=ais_user&uuid=92b0530b-1e3a-49d6-a527-793251936cf9

  // potential icons:
  // https://www.freepik.com/free-vector/several-green-grass-borders-realistic-design_1089459.htm#page=9&query=grass%20texture&position=47&from_view=keyword&track=ais_user&uuid=92b0530b-1e3a-49d6-a527-793251936cf9

  public groundList: IGround[] = [];
  public showGroundOptions: boolean = false;

  constructor(
    public gardenService: GardenService,
    private engineService: EngineService
  ) { }

  ngOnInit(): void {
    this.groundList.push({
      id: 1,
      name: 'Festuca rubra',
      img: 'festuca rubra',
      description: 'TODO' // note: remember about translation
    });
    this.groundList.push({
      id: 2,
      name: 'Poa pratensis',
      img: 'poa pratensis',
      description: 'TODO'
    });

    // TODO:
    // add more types of grass
  }

  public toggleGroundOptions(event: Event): void {
    this.showGroundOptions = !this.showGroundOptions;
    event.stopPropagation();
  }

  public resetCameraPosition() {
    this.engineService.resetCameraPosition();
  }

  public setGround(ground: IGround) {
    this.gardenService.setGround(ground);
  }
}
