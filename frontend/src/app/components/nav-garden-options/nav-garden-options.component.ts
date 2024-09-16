import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IDirection } from 'src/app/models/interfaces/i-direction';
import { IElement } from 'src/app/models/interfaces/i-element';
import { IElementCategory } from 'src/app/models/interfaces/i-element-category';
import { IEnvironment } from 'src/app/models/interfaces/i-environment';
import { IFence } from 'src/app/models/interfaces/i-fence';
import { IGround } from 'src/app/models/interfaces/i-ground';
import { Direction } from 'src/app/models/types/direction';
import { EngineService } from 'src/app/services/engine.service';
import { GardenService } from 'src/app/services/garden.service';
import { EntranceToolService } from 'src/app/tools/entrance-tool.service';
import { PavementToolService } from 'src/app/tools/pavement-tool.service';
import { ConstantHelper } from 'src/app/utils/constant-helper';

@Component({
  selector: 'app-nav-garden-options',
  templateUrl: './nav-garden-options.component.html',
  styleUrls: ['./nav-garden-options.component.scss']
})
export class NavGardenOptionsComponent implements OnInit {
  @Output() isOpenEntranceTool: EventEmitter<Direction> = new EventEmitter<Direction>();

  // ground textures from https://pl.freepik.com
  // https://pl.freepik.com/darmowe-wektory/wzor-bez-szwu-zielonej-trawie_13187581.htm#fromView=search&page=1&position=2&uuid=f90cebc8-5133-4d24-8e09-284ece62e73a
  // https://www.freepik.com/free-vector/green-grass-vector-seamless-texture-lawn-nature-meadow-plant-field-natural-outdoor-illustration_11059458.htm#page=8&query=grass%20texture&position=21&from_view=keyword&track=ais_user&uuid=92b0530b-1e3a-49d6-a527-793251936cf9

  // ground icons from https://pl.freepik.com
  // https://www.freepik.com/free-vector/plant-stems-front-plan-nature-illustration-isolated-green-grass-realistic-detailed-fresh-green-vector-grass_37153713.htm#fromView=search&page=3&position=19&uuid=26c7c2d1-051a-4e4b-af85-6e0f118cddf0
  // https://www.freepik.com/free-vector/green-grass-border-realistic-design_4904201.htm#from_view=detail_alsolike

  public groundList: IGround[] = [];
  public environmentList: IEnvironment[] = [];
  public fenceList: IFence[] = [];
  public elementCategoriesList: IElementCategory[] = [];
  public chosenCategoryElementsList: IElement[] = [];
  public entranceDirectionList: IDirection[] = [
    { name: "North", icon: "north" },
    { name: "South", icon: "south" },
    { name: "East", icon: "east" },
    { name: "West", icon: "west" }
  ];

  public showGroundOptions: boolean = false;
  public showEnvironmentOptions: boolean = false;
  public showAddElementsOptions: boolean = false;
  public showFenceOptions: boolean = false;
  public showEntranceOptions: boolean = false;

  public showChooseElementOptions: boolean = false;

  constructor(
    public gardenService: GardenService,
    public engineService: EngineService,
    private entranceTool: EntranceToolService,
    private pavementTool: PavementToolService
  ) { }

  ngOnInit(): void {
    this.loadGrounds();
    this.loadEnvironments();
    this.loadFences();
    this.loadElementsCategories();
  }

  public toggleGroundOptions(event: Event): void {
    this.showGroundOptions = !this.showGroundOptions;
    event.stopPropagation();
  }

  public toggleAddElementsOption(event: Event): void {
    this.showAddElementsOptions = (this.showChooseElementOptions) ? false : !this.showAddElementsOptions;
    this.showChooseElementOptions = false;
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

  public toggleEnvironmentOptions(event: Event): void {
    this.showEnvironmentOptions = !this.showEnvironmentOptions;
    event.stopPropagation();
  }

  public resetCameraPosition() {
    this.engineService.resetCameraPosition();
  }

  public toggle2DMode() {
    this.engineService.toggle2DMode();
  }

  public setGround(ground: IGround) {
    this.gardenService.setGround(ground);
  }

  public setEnvironment(environment: IEnvironment) {
    this.gardenService.setEnvironment(environment);
  }

  public setFence(fence: IFence) {
    this.gardenService.setFence(fence);
  }

  public openAddElementCategory(elementCategory: string): void {
    this.showAddElementsOptions = false;
    this.showChooseElementOptions = true;

    this.gardenService.getElementsByCategory(elementCategory).subscribe(
      (chosenCategoryElementsList: IElement[]) => {
        this.chosenCategoryElementsList = chosenCategoryElementsList;
      },
      error => {
        console.error('Error loading elements: ', error);
      }
    );
  }

  public chooseElementToPlace(element: IElement): void {
    this.showChooseElementOptions = false;
    switch (element.category) {
      case ConstantHelper.pavementCategory:
        this.pavementTool.initializePavementVisualisation(element.name);
        break;
      case ConstantHelper.treeCategory:
        // TODO
        break;
      case ConstantHelper.bushCategory:
        // TODO
        break;
      default:
        // TODO
        break;
    }
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

  private loadEnvironments(): void {
    this.gardenService.getEnvironments().subscribe(
      (environmentList: IEnvironment[]) => {
        this.environmentList = environmentList;
      },
      error => {
        console.error('Error loading environments: ', error);
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

  private loadElementsCategories(): void {
    this.gardenService.getElementCategories().subscribe(
      (elementCategoriesList: IElementCategory[]) => {
        this.elementCategoriesList = elementCategoriesList;
      },
      error => {
        console.error('Error loading element categories: ', error);
      }
    );
  }
}
