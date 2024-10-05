import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/models/interfaces/i-user';
import { Role } from 'src/app/models/types/role';
import { EngineService } from 'src/app/services/engine.service';
import { GardenService } from 'src/app/services/garden.service';
import { ProjectLoaderService } from 'src/app/services/project-loader.service';
import { UserRoleService } from 'src/app/services/user-role.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public openProjectTab: boolean | undefined;
  public userRole: Role | undefined;

  private id = "";

  private isOpenProjectTabSubscription: Subscription | undefined;
  private isCurrentProjectSubscription: Subscription | undefined;
  private userRoleSubscription: Subscription | undefined;

  constructor(
    public userService: UserService,
    private projectLoaderService: ProjectLoaderService,
    private engineService: EngineService,
    private gardenService: GardenService,
    private userRoleService: UserRoleService
  ) { }

  async ngOnInit(): Promise<void> {
    this.openProjectTab = true;

    const userString = localStorage.getItem('garden-design-app-user');

    if (userString) {
      const user: IUser = JSON.parse(userString);
      this.userService.setCurrentUser(user);

      const token: string = user.token;

      if (token) {
        const decodedToken: any = jwtDecode(token);
        this.userRole = decodedToken.role;
      }
    }

    this.isOpenProjectTabSubscription = this.projectLoaderService.getIsOpenProjectTab().subscribe(
      openProjectTab => {
        this.openProjectTab = openProjectTab;
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

    this.userRoleSubscription = this.userRoleService.getUserRole().subscribe(
      userRole => {
        this.userRole = userRole
      }
    );
  }

  ngOnDestroy(): void {
    if (this.isOpenProjectTabSubscription)
      this.isOpenProjectTabSubscription.unsubscribe();
    if (this.isCurrentProjectSubscription)
      this.isCurrentProjectSubscription.unsubscribe();
    if (this.userRoleSubscription)
      this.userRoleSubscription.unsubscribe();
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
      this.engineService.initialize(canvas.nativeElement);
      this.gardenService.initialize3DVisualisation();
    }
  }

  private isInputFocused(): boolean {
    const activeElement = document.activeElement;
    return activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;
  }
}