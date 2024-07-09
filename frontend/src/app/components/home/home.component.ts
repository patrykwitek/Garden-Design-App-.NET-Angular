import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { EngineService } from 'src/app/services/engine.service';
import { GardenService } from 'src/app/services/garden.service';
import { LoginService } from 'src/app/services/login.service';
import { ProjectLoaderService } from 'src/app/services/project-loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public openProjectTab: boolean | undefined;

  private id = ""; // TODO: check if it's needed

  private isOpenProjectTabSubscription: Subscription | undefined;
  private isCurrentProjectSubscription: Subscription | undefined;

  constructor(
    public loginService: LoginService,
    private projectLoaderService: ProjectLoaderService,
    private engineService: EngineService,
    private gardenService: GardenService
  ) { }

  ngOnInit(): void {
    this.openProjectTab = this.projectLoaderService.getOpenProjectTab();

    this.isOpenProjectTabSubscription = this.projectLoaderService.getIsOpenProjectTab().subscribe(
      openProjectTab => {
        if (openProjectTab)
          this.openProjectTab = true;
      }
    );

    this.isCurrentProjectSubscription = this.projectLoaderService.getCurrentProject().subscribe(
      res => {
        if (res?.id && res.id !== this.id && this.openProjectTab) {
          this.openProjectTab = false;
          this.id = res.id;
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.isOpenProjectTabSubscription)
      this.isOpenProjectTabSubscription.unsubscribe();
    if (this.isCurrentProjectSubscription)
      this.isCurrentProjectSubscription.unsubscribe();

    // TODO: set animation state of engine to 1 (?)
  }

  @HostListener("window:keyup", ["$event"])
  public handleKeyUp(event: KeyboardEvent): void {
    if (this.openProjectTab || this.isInputFocused()) {
      return;
    }

    if (event.key === "t") {
      // TODO: adding tree tool
    }

    if (event.key === "p") {
      // TODO: adding pavement tool
    }
  }

  @ViewChild("viewerCanvas")
  public set viewerCanvas(canvas: ElementRef<HTMLCanvasElement>) {
    if (canvas) {
      // TODO: check if needed
      // void this.preloadTextures().then(() => {
      //   this.initializeEngine(canvas);
      // });

      this.engineService.initialize(canvas.nativeElement);
      this.gardenService.addTestCubes();
    }
  }

  private isInputFocused(): boolean {
    const activeElement = document.activeElement;
    return activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;
  }

  private async preloadTextures(): Promise<void> {
    // TODO: await this.textureLoaderService.loadTexture("grass_texture.png");
  }

}