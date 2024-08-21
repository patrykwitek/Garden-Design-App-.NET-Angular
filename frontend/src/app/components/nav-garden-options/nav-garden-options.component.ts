import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IDirection } from 'src/app/models/interfaces/i-direction';
import { IFence } from 'src/app/models/interfaces/i-fence';
import { IGround } from 'src/app/models/interfaces/i-ground';
import { Direction } from 'src/app/models/types/direction';
import { EngineService } from 'src/app/services/engine.service';
import { GardenService } from 'src/app/services/garden.service';
import { EntranceToolService } from 'src/app/tools/entrance-tool.service';

@Component({
  selector: 'app-nav-garden-options',
  templateUrl: './nav-garden-options.component.html',
  styleUrls: ['./nav-garden-options.component.scss']
})
export class NavGardenOptionsComponent implements OnInit {
  @Output() isOpenEntranceTool: EventEmitter<Direction> = new EventEmitter<Direction>();

  // note: ground textures from https://pl.freepik.com
  // https://pl.freepik.com/darmowe-wektory/wzor-bez-szwu-zielonej-trawie_13187581.htm#fromView=search&page=1&position=2&uuid=f90cebc8-5133-4d24-8e09-284ece62e73a
  // https://www.freepik.com/free-vector/green-grass-vector-seamless-texture-lawn-nature-meadow-plant-field-natural-outdoor-illustration_11059458.htm#page=8&query=grass%20texture&position=21&from_view=keyword&track=ais_user&uuid=92b0530b-1e3a-49d6-a527-793251936cf9

  // potential icons:
  // https://www.freepik.com/free-vector/several-green-grass-borders-realistic-design_1089459.htm#page=9&query=grass%20texture&position=47&from_view=keyword&track=ais_user&uuid=92b0530b-1e3a-49d6-a527-793251936cf9

  public groundList: IGround[] = [];
  public fenceList: IFence[] = [];
  public entranceDirectionList: IDirection[] = [
    { name: "North", icon: "north" },
    { name: "South", icon: "south" },
    { name: "East", icon: "east" },
    { name: "West", icon: "west" }
  ];

  public showGroundOptions: boolean = false;
  public showFenceOptions: boolean = false;
  public showEntranceOptions: boolean = false;

  constructor(
    public gardenService: GardenService,
    private engineService: EngineService,
    private entranceTool: EntranceToolService
  ) { }

  ngOnInit(): void {
    this.loadGrounds();
    this.loadFences();

    // TODO:
    // add more types of grass
  }

  public toggleGroundOptions(event: Event): void {
    this.showGroundOptions = !this.showGroundOptions;
    event.stopPropagation();
  }

  public toggleFenceOptions(event: Event): void {
    this.showFenceOptions = !this.showFenceOptions;
    event.stopPropagation();
  }

  public toggleEntranceOptions(event: Event): void {
    this.showEntranceOptions = !this.showEntranceOptions;
    event.stopPropagation();
  }

  public resetCameraPosition() {
    this.engineService.resetCameraPosition();
  }

  public setGround(ground: IGround) {
    this.gardenService.setGround(ground);
  }

  public setFence(fence: IFence) {
    this.gardenService.setFence(fence);
  }

  public openEntranceTool(direction: Direction) {
    this.showEntranceOptions = false;
    this.engineService.setCamera(direction);
    this.entranceTool.initializeEntranceVisualisation(direction);
    this.isOpenEntranceTool.emit(direction);
  }

  private loadGrounds(): void {
    this.gardenService.getGrounds().subscribe(
      (groundList: IGround[]) => {
        this.groundList = groundList;
      },
      error => {
        console.error('Error loading grounds: ', error);
      }
    );
  }

  private loadFences(): void {
    this.gardenService.getFences().subscribe(
      (fenceList: IFence[]) => {
        this.fenceList = fenceList;
      },
      error => {
        console.error('Error loading fences: ', error);
      }
    );
  }
}
