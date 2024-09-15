import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThemeService } from './theme.service';
import { ConstantHelper } from '../utils/constant-helper';
import { Fence } from '../models/types/fence';
import { Direction } from '../models/types/direction';
import { HttpClient } from '@angular/common/http';
import { IEntrance } from '../models/interfaces/i-entrance';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { gsap } from 'gsap';
import { CSG } from 'three-csg-ts';
import { IPavement } from '../models/interfaces/i-pavement';
import { IGardenElement } from '../models/interfaces/i-garden-element';
import { ITree } from '../models/interfaces/i-tree';
import { IBush } from '../models/interfaces/i-bush';

@Injectable({
  providedIn: 'root'
})
export class EngineService {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  private controls!: OrbitControls;

  private objects: THREE.Object3D[] = [];
  private isAnimating: boolean = false;

  private ground: THREE.Mesh | undefined;

  private width: number | undefined;
  private depth: number | undefined;

  private entranceVisualisation: THREE.Mesh | undefined;
  private pavementVisualisation: THREE.Mesh | undefined;

  private isSavePavementPossible: boolean | undefined;

  private eventListeners: { type: string, listener: EventListenerOrEventListenerObject }[] = [];

  private textureLoader: THREE.TextureLoader = new THREE.TextureLoader();

  private raycaster: THREE.Raycaster | undefined;
  private mouse: THREE.Vector2 | undefined;

  private noEntranceNorthFence: THREE.Group<THREE.Object3DEventMap> | undefined;
  private noEntranceSouthFence: THREE.Group<THREE.Object3DEventMap> | undefined;
  private noEntranceWestFence: THREE.Group<THREE.Object3DEventMap> | undefined;
  private noEntranceEastFence: THREE.Group<THREE.Object3DEventMap> | undefined;

  private entrancesList: IEntrance[] = [];
  private gardenElementsList: IGardenElement[] = [];
  private pavementsList: IPavement[] = [];
  private treesList: ITree[] = [];
  private bushesList: IBush[] = [];

  private fenceType: string | undefined;
  private currentProjectId: string | undefined;

  public is2DMode: boolean = false;
  private is2DModeSource = new BehaviorSubject<boolean | null>(null);
  public is2DMode$ = this.is2DModeSource.asObservable();

  constructor(
    private themeService: ThemeService,
    private http: HttpClient
  ) { }

  public initialize(canvas: HTMLCanvasElement): void {
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.localClippingEnabled = true;
    this.renderer.shadowMap.enabled = true;
    window.addEventListener('resize', () => this.onWindowResize());

    this.scene = new THREE.Scene();
    this.is2DMode = false;

    this.setDefaultCameraSettings();
    this.setLightSettings();
    this.addSky();

    // note: for testing purposes
    // this.addTemporaryCompass();
  }

  public animate(): void {
    if (!this.isAnimating) {
      return;
    }

    requestAnimationFrame(() => this.animate());

    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }

  public setAnimating(isAnimating: boolean) {
    this.isAnimating = isAnimating;
  }

  public dispose(): void {
    this.setAnimating(false);

    this.objects.forEach(obj => {
      this.scene.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach(material => material.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    if (this.ground) {
      this.scene.remove(this.ground);
      this.ground.geometry.dispose();
      if (Array.isArray(this.ground.material)) {
        this.ground.material.forEach(material => material.dispose());
      } else {
        this.ground.material.dispose();
      }
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    this.objects = [];
    this.scene = null!;
    this.camera = null!;

    if (this.controls) {
      this.controls.dispose();
    }

    this.is2DMode = false;
    this.is2DModeSource.next(false);
  }

  public async setFence(fenceType: string): Promise<void> {
    this.fenceType = fenceType;

    // fences links:
    // https://www.cgtrader.com/free-3d-models/exterior/other/cc0-wood-fence
    // https://free3d.com/3d-model/-rectangular-box-hedge--896206.html

    this.objects = this.objects.filter(obj => {
      if ((obj.userData['type'] === 'north-fence-group') || (obj.userData['type'] === 'south-fence-group') || (obj.userData['type'] === 'west-fence-group') || (obj.userData['type'] === 'east-fence-group')) {
        this.scene.remove(obj);
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(material => material.dispose());
          } else {
            obj.material.dispose();
          }
        }
        return false;
      }
      return true;
    });

    const fence = ConstantHelper.getFenceByType(fenceType);

    if (this.width && this.depth) {
      if (fence.destination.fileName.includes('.gltf') || fence.destination.fileName.includes('.glf')) {
        await this.loadFenceFromGTLF(this.width, this.depth, fence);
      }
      else if (fence.destination.fileName.includes('.obj') || (fence.destination.fileName.includes('.mlt'))) {
        await this.loadFenceFromOBJ(this.width, this.depth, fence);
      }
      else {
        throw new Error("Unsupported model file extension");
      }
    }

    this.loadEntrances();

    // note: for testing purposes
    // this.buildTestBorder(width, depth);
  }

  public async setGardenElements(): Promise<void> {
    await this.loadGardenElements();
    if (this.gardenElementsList) {
      this.pavementsList = this.gardenElementsList.filter(element => element.category === 'Pavement')
      this.treesList = this.gardenElementsList.filter(element => element.category === 'Tree')
      this.bushesList = this.gardenElementsList.filter(element => element.category === 'Bush')
    }
  }

  public setGround(textureName: string): void {
    if (this.ground) {
      this.scene.remove(this.ground);
      this.ground.geometry.dispose();
      if (Array.isArray(this.ground.material)) {
        this.ground.material.forEach(material => material.dispose());
      } else {
        this.ground.material.dispose();
      }
    }

    this.textureLoader.load(`assets/textures/grounds/${textureName}.jpg`, (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(200, 200);

      const geometry = new THREE.PlaneGeometry(1000, 1000);
      const material = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.x = -Math.PI / 2;
      plane.receiveShadow = true;

      this.ground = plane;
      this.scene.add(plane);
      this.objects.push(plane);
    });
  }

  public setGardenDimensions(width: number, depth: number) {
    this.width = width;
    this.depth = depth;
  }

  public setCurrentProject(projectId: string | undefined) {
    this.currentProjectId = projectId;
  }

  public resetCameraPosition() {
    if (this.width && this.depth) {
      if (this.is2DMode) {
        this.set2DModeCamera();
      }
      else if (!this.is2DMode) {
        gsap.to(this.camera.position, {
          duration: 1,
          x: 0,
          y: 5,
          z: -(this.depth / 2) - (this.width / 3),
          onUpdate: () => {
            this.camera.lookAt(0, 0, 0);
          }
        });
      }

      this.controls.dispose();
      this.setOrbitControlsSettings();
    }
  }

  public toggle2DMode(): void {
    this.is2DMode = !this.is2DMode;
    this.is2DModeSource.next(this.is2DMode);

    if (this.is2DMode) {
      if (this.width && this.depth) {
        this.set2DModeCamera();
        this.addBorderVisualisation();
      }
    }
    else if (!this.is2DMode) {
      this.removeBorderVisualisation();
      this.setDefaultCameraSettings();
      this.resetCameraPosition();

      if (this.pavementVisualisation) {
        this.scene.remove(this.pavementVisualisation);
        this.pavementVisualisation = undefined;
        this.removeAllEventListeners();
        this.raycaster = undefined;
        this.mouse = undefined;
      }
    }

    this.controls.dispose();
    this.setOrbitControlsSettings();
  }

  public setCamera(direction: Direction) {
    this.is2DMode = false;
    this.is2DModeSource.next(false);
    this.setDefaultCameraSettings();

    if (this.width && this.depth) {
      let x: number = 0;
      let y: number = 1;
      let z: number = 0;

      switch (direction) {
        case "North": {
          z = (this.depth / 2) + (this.width / 2.5);
          break;
        }
        case "South": {
          z = -(this.depth / 2) - (this.width / 2.5);
          break;
        }
        case "East": {
          x = -(this.width / 2) - (this.depth / 2.2);
          break;
        }
        case "West": {
          x = (this.width / 2) + (this.depth / 2.2);
          break;
        }
        default: {
          break;
        }
      }

      this.camera.position.set(x, y, z);
      this.camera.lookAt(0, 0, 0);

      this.controls.enableRotate = false;
      this.controls.enableZoom = false;
      this.controls.enablePan = false;

      this.controls.target.set(0, 0, 0);
      this.controls.update();
    }
  }

  public addSky(): void {
    // sky box links: 
    // https://opengameart.org/content/sky-box-sunny-day
    // https://opengameart.org/content/space-skybox-0
    // TODO: change for another (?)

    const themeMode = this.themeService.isDarkMode() ? 'night' : 'day';

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      `assets/textures/skyboxes/${themeMode}/px.bmp`, // right
      `assets/textures/skyboxes/${themeMode}/nx.bmp`, // left
      `assets/textures/skyboxes/${themeMode}/py.bmp`, // top
      `assets/textures/skyboxes/${themeMode}/ny.bmp`, // bottom
      `assets/textures/skyboxes/${themeMode}/pz.bmp`, // front
      `assets/textures/skyboxes/${themeMode}/nz.bmp`  // back
    ]);

    this.scene.background = texture;
  }

  public setLightSettings(): void {
    const existingLights = this.scene.children.filter(object => object instanceof THREE.Light);
    existingLights.forEach(light => this.scene.remove(light));

    const isDarkMode: boolean = this.themeService.isDarkMode();

    const ambientIntensity: number = isDarkMode ? .4 : 1;
    const directionalIntensity: number = isDarkMode ? .5 : 1;
    const secondaryIntensity: number = isDarkMode ? .2 : .5;

    const ambientLight = new THREE.AmbientLight(0x404040, ambientIntensity);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, directionalIntensity);
    directionalLight.position.set(5, 10, 15);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;

    this.scene.add(directionalLight);

    const secondaryLight = new THREE.DirectionalLight(0xffffff, secondaryIntensity);
    secondaryLight.position.set(-5, 10, -15);
    this.scene.add(secondaryLight);
  }

  public initializeEntranceVisualisation(x: number, y: number, direction: Direction): void {
    this.clearEntranceVisualisation();
    this.removeBorderVisualisation();

    if (this.pavementVisualisation) {
      this.scene.remove(this.pavementVisualisation);
      this.pavementVisualisation = undefined;
      this.removeAllEventListeners();
      this.raycaster = undefined;
      this.mouse = undefined;
    }

    const geometry = new THREE.BoxGeometry(ConstantHelper.entranceWidth, 1.5, .2);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.entranceVisualisation = new THREE.Mesh(geometry, material);
    this.entranceVisualisation.userData['type'] = 'entranceVisualisation';

    this.entranceVisualisation.position.x = x;
    this.entranceVisualisation.position.y = .75;
    this.entranceVisualisation.position.z = y;

    if (direction === 'West' || direction === 'East') {
      this.entranceVisualisation.rotation.y = Math.PI / 2;
    }

    this.scene.add(this.entranceVisualisation);
    this.objects.push(this.entranceVisualisation);
  }

  public initializePavementVisualisation(pavementName: string): void {
    if (!this.is2DMode && this.width && this.depth) {
      this.is2DMode = !this.is2DMode;
      this.is2DModeSource.next(this.is2DMode);

      this.set2DModeCamera();
      this.addBorderVisualisation();

      this.controls.dispose();
      this.setOrbitControlsSettings();
    }

    if (this.pavementVisualisation) {
      this.scene.remove(this.pavementVisualisation);
      this.pavementVisualisation = undefined;
      this.removeAllEventListeners();
      this.raycaster = undefined;
      this.mouse = undefined;
    }

    this.textureLoader.load(`assets/textures/pavements/${pavementName.toLowerCase()}.jpg`, (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(ConstantHelper.entranceWidth * 1.17, ConstantHelper.entranceWidth * 1.17);

      const pavementGeometry = new THREE.PlaneGeometry(ConstantHelper.entranceWidth, ConstantHelper.entranceWidth);
      const pavementMaterial = new THREE.MeshStandardMaterial({ map: texture, roughness: 1, metalness: 0, transparent: true, opacity: .8 });

      this.pavementVisualisation = new THREE.Mesh(pavementGeometry, pavementMaterial);
      this.pavementVisualisation.rotation.x = -Math.PI / 2;
      this.pavementVisualisation.position.set(0, 0.01, 0);
      this.pavementVisualisation.receiveShadow = true;

      this.scene.add(this.pavementVisualisation);
      this.objects.push(this.pavementVisualisation);

      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();

      this.isSavePavementPossible = false;

      this.addEventListener('mousemove', this.changePavementPositionOnMouseMove.bind(this));
      this.addEventListener('click', this.savePavementPosition.bind(this));
      this.addEventListener('keydown', this.closePavementTool.bind(this));
    });
  }

  public clearEntranceVisualisation() {
    this.objects = this.objects.filter(obj => {
      if (obj.userData['type'] === 'entranceVisualisation') {
        this.scene.remove(obj);
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(material => material.dispose());
          } else {
            obj.material.dispose();
          }
        }
        return false;
      }
      return true;
    });
  }

  public changeEntranceVisualisationPosition(newPosition: number, direction: Direction) {
    if (this.entranceVisualisation && this.width && this.depth) {
      let offset: number = 0;

      if (direction === 'South') {
        offset = (this.width / 2);
        newPosition = -newPosition;
        this.entranceVisualisation.position.x = newPosition + offset;
      }
      else if (direction === 'North') {
        offset = -(this.width / 2);
        this.entranceVisualisation.position.x = newPosition + offset;
      }
      else if (direction === 'West') {
        offset = (this.depth / 2);
        newPosition = -newPosition;
        this.entranceVisualisation.position.z = newPosition + offset;
      }
      else if (direction === 'East') {
        offset = -(this.depth / 2);
        this.entranceVisualisation.position.z = newPosition + offset;
      }
    }
  }

  public setEntrance(direction: Direction) {
    // TODO: optimise this method
    if (this.fenceType) this.setFence(this.fenceType);
  }

  private closePavementTool(event: any): void {
    if (event.key === 'Escape') {
      this.scene.remove(this.pavementVisualisation!);
      this.removeAllEventListeners();

      this.pavementVisualisation = undefined;
      this.raycaster = undefined;
      this.mouse = undefined;
    }
  }

  private set2DModeCamera(): void {
    const zoomFactor: number = 58;

    this.camera = new THREE.OrthographicCamera(
      -window.innerWidth / (2 * zoomFactor),
      window.innerWidth / (2 * zoomFactor),
      window.innerHeight / (2 * zoomFactor),
      -window.innerHeight / (2 * zoomFactor),
      0.1,
      1000
    );

    this.camera.position.set(0, 6, 0);
    this.camera.lookAt(0, 0, 0);
    this.camera.up.set(0, 0, 1);
  }

  private addEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
    window.addEventListener(type, listener, false);
    this.eventListeners.push({ type, listener });
  }

  private removeAllEventListeners(): void {
    this.eventListeners.forEach(({ type, listener }) => {
      window.removeEventListener(type, listener, false);
    });
    this.eventListeners = [];
  }

  private changePavementPositionOnMouseMove(event: any) {
    if (!this.mouse || !this.raycaster || !this.pavementVisualisation || !this.ground || !this.width || !this.depth || !this.entrancesList) {
      return;
    }

    if (this.isSavePavementPossible) {
      (this.pavementVisualisation!.material as THREE.MeshStandardMaterial).opacity = 1;
    }
    else {
      (this.pavementVisualisation!.material as THREE.MeshStandardMaterial).opacity = .6;
    }

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObject(this.ground);
    if (intersects.length > 0) {
      let isCursorInside: boolean = true;

      const point = intersects[0].point;

      const borderWidth = (this.width / 2) - (ConstantHelper.entranceWidth / 2);
      const borderDepth = (this.depth / 2) - (ConstantHelper.entranceWidth / 2);

      if (point.x <= -borderWidth) {
        isCursorInside = false;
        this.pavementVisualisation.position.set(-borderWidth, 0.01, point.z);
      }

      if (point.x >= borderWidth) {
        isCursorInside = false;
        this.pavementVisualisation.position.set(borderWidth, 0.01, point.z);
      }

      if (point.z <= -borderDepth) {
        isCursorInside = false;
        this.pavementVisualisation.position.set(point.x, 0.01, -borderDepth);
      }

      if (point.z >= borderDepth) {
        isCursorInside = false;
        this.pavementVisualisation.position.set(point.x, 0.01, borderDepth);
      }

      if (point.z >= borderDepth && point.x >= borderWidth) {
        isCursorInside = false;
        this.pavementVisualisation.position.set(borderWidth, 0.01, borderDepth);
      }

      if (point.z >= borderDepth && point.x <= -borderWidth) {
        isCursorInside = false;
        this.pavementVisualisation.position.set(-borderWidth, 0.01, borderDepth);
      }

      if (point.z <= -borderDepth && point.x >= borderWidth) {
        isCursorInside = false;
        this.pavementVisualisation.position.set(borderWidth, 0.01, -borderDepth);
      }

      if (point.z <= -borderDepth && point.x <= -borderWidth) {
        isCursorInside = false;
        this.pavementVisualisation.position.set(-borderWidth, 0.01, -borderDepth);
      }

      if (isCursorInside) {
        this.pavementVisualisation.position.set(point.x, 0.01, point.z);
      }

      this.isSavePavementPossible = false;

      this.entrancesList.forEach(entrance => {
        if (entrance.direction === 'West'
          && this.pavementVisualisation!.position.x >= borderWidth - .1
          && entrance.position >= -(this.pavementVisualisation!.position.z + (ConstantHelper.entranceWidth / 2) - (this.depth! / 2) + .1)
          && entrance.position <= -(this.pavementVisualisation!.position.z - (ConstantHelper.entranceWidth / 2) - (this.depth! / 2) - .1)
        ) {
          this.pavementVisualisation!.position.set(borderWidth, 0.01, -(entrance.position - (this.depth! / 2)));
          this.isSavePavementPossible = true;
          (this.pavementVisualisation!.material as THREE.MeshStandardMaterial).opacity = 1;
        }
        else if (entrance.direction === 'East'
          && this.pavementVisualisation!.position.x <= -borderWidth + .1
          && entrance.position >= -(this.pavementVisualisation!.position.z + (ConstantHelper.entranceWidth / 2) - (this.depth! / 2) + .1)
          && entrance.position <= -(this.pavementVisualisation!.position.z - (ConstantHelper.entranceWidth / 2) - (this.depth! / 2) - .1)
        ) {
          this.pavementVisualisation!.position.set(-borderWidth, 0.01, -(entrance.position - (this.depth! / 2)));
          this.isSavePavementPossible = true;
          (this.pavementVisualisation!.material as THREE.MeshStandardMaterial).opacity = 1;
        }
        else if (entrance.direction === 'North'
          && this.pavementVisualisation!.position.z >= borderDepth - .1
          && entrance.position >= -(this.pavementVisualisation!.position.x + (ConstantHelper.entranceWidth / 2) - (this.width! / 2) + .1)
          && entrance.position <= -(this.pavementVisualisation!.position.x - (ConstantHelper.entranceWidth / 2) - (this.width! / 2) - .1)
        ) {
          this.pavementVisualisation!.position.set(-(entrance.position - (this.width! / 2)), 0.01, borderDepth);
          this.isSavePavementPossible = true;
          (this.pavementVisualisation!.material as THREE.MeshStandardMaterial).opacity = 1;
        }
        else if (entrance.direction === 'South'
          && this.pavementVisualisation!.position.z <= -borderDepth + .1
          && entrance.position >= -(this.pavementVisualisation!.position.x + (ConstantHelper.entranceWidth / 2) - (this.width! / 2) + .1)
          && entrance.position <= -(this.pavementVisualisation!.position.x - (ConstantHelper.entranceWidth / 2) - (this.width! / 2) - .1)
        ) {
          this.pavementVisualisation!.position.set(-(entrance.position - (this.width! / 2)), 0.01, -borderDepth);
          this.isSavePavementPossible = true;
          (this.pavementVisualisation!.material as THREE.MeshStandardMaterial).opacity = 1;
        }
      });

      this.pavementsList.forEach(pavement => {
        // under pavement
        if (this.pavementVisualisation!.position.x <= pavement.x + (ConstantHelper.entranceWidth / 2) + .1
          && this.pavementVisualisation!.position.x >= pavement.x - (ConstantHelper.entranceWidth / 2) - .1
          && this.pavementVisualisation!.position.z >= pavement.y - ConstantHelper.entranceWidth - .1
          && this.pavementVisualisation!.position.z <= pavement.y - (ConstantHelper.entranceWidth / 2)
        ) {
          this.pavementVisualisation!.position.set(pavement.x, 0.01, pavement.y - ConstantHelper.entranceWidth);
          this.isSavePavementPossible = true;
          (this.pavementVisualisation!.material as THREE.MeshStandardMaterial).opacity = 1;
        }
        // above pavement
        else if (this.pavementVisualisation!.position.x <= pavement.x + (ConstantHelper.entranceWidth / 2) + .1
          && this.pavementVisualisation!.position.x >= pavement.x - (ConstantHelper.entranceWidth / 2) - .1
          && this.pavementVisualisation!.position.z <= pavement.y + ConstantHelper.entranceWidth + .1
          && this.pavementVisualisation!.position.z >= pavement.y + (ConstantHelper.entranceWidth / 2)
        ) {
          this.pavementVisualisation!.position.set(pavement.x, 0.01, pavement.y + ConstantHelper.entranceWidth);
          this.isSavePavementPossible = true;
          (this.pavementVisualisation!.material as THREE.MeshStandardMaterial).opacity = 1;
        }
        // on the left side of pavement
        else if (this.pavementVisualisation!.position.x <= pavement.x + ConstantHelper.entranceWidth + .1
          && this.pavementVisualisation!.position.x >= pavement.x + (ConstantHelper.entranceWidth / 2)
          && this.pavementVisualisation!.position.z <= pavement.y + (ConstantHelper.entranceWidth / 2)
          && this.pavementVisualisation!.position.z >= pavement.y - (ConstantHelper.entranceWidth / 2)
        ) {
          this.pavementVisualisation!.position.set(pavement.x + ConstantHelper.entranceWidth, 0.01, pavement.y);
          this.isSavePavementPossible = true;
          (this.pavementVisualisation!.material as THREE.MeshStandardMaterial).opacity = 1;
        }
        // on the right side of pavement
        else if (this.pavementVisualisation!.position.x >= pavement.x - ConstantHelper.entranceWidth + .1
          && this.pavementVisualisation!.position.x <= pavement.x - (ConstantHelper.entranceWidth / 2)
          && this.pavementVisualisation!.position.z <= pavement.y + (ConstantHelper.entranceWidth / 2)
          && this.pavementVisualisation!.position.z >= pavement.y - (ConstantHelper.entranceWidth / 2)
        ) {
          this.pavementVisualisation!.position.set(pavement.x - ConstantHelper.entranceWidth, 0.01, pavement.y);
          this.isSavePavementPossible = true;
          (this.pavementVisualisation!.material as THREE.MeshStandardMaterial).opacity = 1;
        }
      });
    }
  }

  private savePavementPosition(): void {
    if (this.isSavePavementPossible && this.pavementVisualisation) {
      const pavement: IPavement = {
        x: this.pavementVisualisation.position.x,
        y: this.pavementVisualisation.position.z
      };

      this.pavementsList.push(pavement);

      // TODO: save pavement position to the database

      this.removeAllEventListeners();

      this.pavementVisualisation = undefined;
      this.raycaster = undefined;
      this.mouse = undefined;
    }
  }

  private addBorderVisualisation(): void {
    if (this.width && this.depth) {
      const borderGroup = new THREE.Group();
      const material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.4
      });

      const outerBoxGeometry = new THREE.BoxGeometry(1000, .3, 1000);
      const outerBox = new THREE.Mesh(outerBoxGeometry, material);
      outerBox.position.set(0, 0, 0);

      const innerBoxGeometry = new THREE.BoxGeometry(this.width, .4, this.depth);
      const innerBox = new THREE.Mesh(innerBoxGeometry, material);
      innerBox.position.set(0, 0, 0);

      const csgOuterBox = CSG.fromMesh(outerBox);
      const csgInnerBox = CSG.fromMesh(innerBox);
      const subtractedCSG = csgOuterBox.subtract(csgInnerBox);

      const resultMesh = CSG.toMesh(subtractedCSG, outerBox.matrix, material);

      borderGroup.add(resultMesh);
      borderGroup.userData['type'] = 'border-group';

      this.scene.add(borderGroup);
      this.objects.push(borderGroup);

      this.disableShadows();
    }
  }

  private removeBorderVisualisation(): void {
    this.objects = this.objects.filter(obj => {
      if (obj.userData['type'] === 'border-group') {
        this.scene.remove(obj);
        obj.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        return false;
      }
      return true;
    });

    this.enableShadows();
  }

  private disableShadows(): void {
    const directionalLights = this.scene.children.filter(
      object => object instanceof THREE.DirectionalLight
    ) as THREE.DirectionalLight[];

    directionalLights.forEach(light => {
      light.castShadow = false;
    });
  }

  private enableShadows(): void {
    const directionalLights = this.scene.children.filter(
      object => object instanceof THREE.DirectionalLight
    ) as THREE.DirectionalLight[];

    directionalLights.forEach(light => {
      light.castShadow = true;
    });
  }

  private setOrbitControlsSettings() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    if (this.is2DMode) {
      this.controls.enableRotate = false;
      this.controls.enableZoom = true;
      this.controls.zoomSpeed = 1.2;
      this.controls.panSpeed = 0.8;
      this.controls.screenSpacePanning = true;
      this.controls.minZoom = 0.25;
      this.controls.maxZoom = 3;
    }
    else if (!this.is2DMode) {
      this.controls.enableDamping = false;
      this.controls.dampingFactor = 0.25;
      this.controls.screenSpacePanning = false;
      this.controls.maxPolarAngle = (Math.PI / 2) - .005;
      this.controls.minDistance = 5;
      this.controls.maxDistance = 50;
    }

    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  private async loadEntrances() {
    await this.getEntrancesForProject(this.currentProjectId).subscribe(
      (entrances: IEntrance[]) => {
        this.entrancesList = entrances;
        this.cutFencesForEntrances(entrances);
      },
      error => {
        console.error('Error loading entrances: ', error);
      }
    );
  }

  private getEntrancesForProject(projectId: string | undefined): Observable<IEntrance[]> {
    const baseUrl = environment.apiUrl;
    return this.http.get<IEntrance[]>(baseUrl + `solution/getEntrancesForProject/${projectId}`);
  }

  private async loadGardenElements() {
    await this.getElementsForGarden(this.currentProjectId).subscribe(
      (gardenElementsList: IGardenElement[]) => {
        this.gardenElementsList = gardenElementsList;
      },
      error => {
        console.error('Error loading garden elements: ', error);
      }
    );
  }

  private getElementsForGarden(projectId: string | undefined): Observable<IGardenElement[]> {
    const baseUrl = environment.apiUrl;
    return this.http.get<IGardenElement[]>(baseUrl + `solution/getElementsForProject/${projectId}`);
  }

  private cutFencesForEntrances(entrances: IEntrance[]): void {
    entrances = entrances.sort((a, b) => a.position - b.position);

    let northEntrances: IEntrance[] = entrances.filter(entrance => entrance.direction === 'North');

    let southEntrances: IEntrance[] = entrances.filter(entrance => entrance.direction === 'South');

    let westEntrances: IEntrance[] = entrances.filter(entrance => entrance.direction === 'West');

    let eastEntrances: IEntrance[] = entrances.filter(entrance => entrance.direction === 'East');

    if (northEntrances.length !== 0) {
      const northFenceGroup = this.noEntranceNorthFence;

      this.objects = this.objects.filter(obj => {
        if ((obj.userData['type'] === 'north-fence-group')) {
          this.scene.remove(obj);
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach(material => material.dispose());
            } else {
              obj.material.dispose();
            }
          }
          return false;
        }
        return true;
      });

      northEntrances.map(entrance => entrance.position = this.width! - entrance.position);
      northEntrances.sort((a, b) => a.position - b.position);

      for (let i = 0; i <= northEntrances.length; i++) {
        const singleNorthFence = northFenceGroup!.clone();
        let cuts: any[] = [];

        if (i === 0) {
          const cut1 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), (this.width! / 2));
          const cut2 = new THREE.Plane(new THREE.Vector3(1, 0, 0), -(this.width! / 2) + northEntrances[i].position - (ConstantHelper.entranceWidth / 2));

          cuts.push(cut1);
          cuts.push(cut2);
        }
        else if (i !== northEntrances.length) {
          const cut1 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), (this.width! / 2) - northEntrances[i - 1].position - (ConstantHelper.entranceWidth / 2));
          const cut2 = new THREE.Plane(new THREE.Vector3(1, 0, 0), -(this.width! / 2) + northEntrances[i].position - (ConstantHelper.entranceWidth / 2));

          cuts.push(cut1);
          cuts.push(cut2);
        }
        else {
          const cut = new THREE.Plane(new THREE.Vector3(-1, 0, 0), (this.width! / 2) - northEntrances[i - 1].position - (ConstantHelper.entranceWidth / 2));
          cuts.push(cut);
        }

        singleNorthFence.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = child.material.clone();
            child.material.clippingPlanes = cuts;
            child.material.clipShadows = true;
          }
        });

        this.objects.push(singleNorthFence);
        this.scene.add(singleNorthFence);
      }
    }

    if (southEntrances.length !== 0) {
      const southFenceGroup = this.noEntranceSouthFence;

      this.objects = this.objects.filter(obj => {
        if ((obj.userData['type'] === 'south-fence-group')) {
          this.scene.remove(obj);
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach(material => material.dispose());
            } else {
              obj.material.dispose();
            }
          }
          return false;
        }
        return true;
      });

      for (let i = 0; i <= southEntrances.length; i++) {
        const singleSouthFence = southFenceGroup!.clone();
        let cuts: any[] = [];

        if (i === 0) {
          const cut1 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), (this.width! / 2));
          const cut2 = new THREE.Plane(new THREE.Vector3(1, 0, 0), -(this.width! / 2) + southEntrances[i].position - (ConstantHelper.entranceWidth / 2));

          cuts.push(cut1);
          cuts.push(cut2);
        }
        else if (i !== southEntrances.length) {
          const cut1 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), (this.width! / 2) - southEntrances[i - 1].position - (ConstantHelper.entranceWidth / 2));
          const cut2 = new THREE.Plane(new THREE.Vector3(1, 0, 0), -(this.width! / 2) + southEntrances[i].position - (ConstantHelper.entranceWidth / 2));

          cuts.push(cut1);
          cuts.push(cut2);
        }
        else {
          const cut = new THREE.Plane(new THREE.Vector3(-1, 0, 0), (this.width! / 2) - southEntrances[i - 1].position - (ConstantHelper.entranceWidth / 2));
          cuts.push(cut);
        }

        singleSouthFence.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = child.material.clone();
            child.material.clippingPlanes = cuts;
            child.material.clipShadows = true;
          }
        });

        this.objects.push(singleSouthFence);
        this.scene.add(singleSouthFence);
      }
    }

    if (westEntrances.length !== 0) {
      const westFenceGroup = this.noEntranceWestFence;

      this.objects = this.objects.filter(obj => {
        if ((obj.userData['type'] === 'west-fence-group')) {
          this.scene.remove(obj);
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach(material => material.dispose());
            } else {
              obj.material.dispose();
            }
          }
          return false;
        }
        return true;
      });

      for (let i = 0; i <= westEntrances.length; i++) {
        const singleWestFence = westFenceGroup!.clone();
        let cuts: any[] = [];

        if (i === 0) {
          const cut1 = new THREE.Plane(new THREE.Vector3(0, 0, -1), (this.depth! / 2));
          const cut2 = new THREE.Plane(new THREE.Vector3(0, 0, 1), -(this.depth! / 2) + westEntrances[i].position - (ConstantHelper.entranceWidth / 2));

          cuts.push(cut1);
          cuts.push(cut2);
        }
        else if (i !== westEntrances.length) {
          const cut1 = new THREE.Plane(new THREE.Vector3(0, 0, -1), (this.depth! / 2) - westEntrances[i - 1].position - (ConstantHelper.entranceWidth / 2));
          const cut2 = new THREE.Plane(new THREE.Vector3(0, 0, 1), -(this.depth! / 2) + westEntrances[i].position - (ConstantHelper.entranceWidth / 2));

          cuts.push(cut1);
          cuts.push(cut2);
        }
        else {
          const cut = new THREE.Plane(new THREE.Vector3(0, 0, -1), (this.depth! / 2) - westEntrances[i - 1].position - (ConstantHelper.entranceWidth / 2));
          cuts.push(cut);
        }

        singleWestFence.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = child.material.clone();
            child.material.clippingPlanes = cuts;
            child.material.clipShadows = true;
          }
        });

        this.objects.push(singleWestFence);
        this.scene.add(singleWestFence);
      }
    }

    if (eastEntrances.length !== 0) {
      const eastFenceGroup = this.noEntranceEastFence;

      this.objects = this.objects.filter(obj => {
        if ((obj.userData['type'] === 'east-fence-group')) {
          this.scene.remove(obj);
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach(material => material.dispose());
            } else {
              obj.material.dispose();
            }
          }
          return false;
        }
        return true;
      });

      eastEntrances.map(entrance => entrance.position = this.depth! - entrance.position);
      eastEntrances.sort((a, b) => a.position - b.position);

      for (let i = 0; i <= eastEntrances.length; i++) {
        const singleEastFence = eastFenceGroup!.clone();
        let cuts: any[] = [];

        if (i === 0) {
          const cut1 = new THREE.Plane(new THREE.Vector3(0, 0, -1), (this.depth! / 2));
          const cut2 = new THREE.Plane(new THREE.Vector3(0, 0, 1), -(this.depth! / 2) + eastEntrances[i].position - (ConstantHelper.entranceWidth / 2));

          cuts.push(cut1);
          cuts.push(cut2);
        }
        else if (i !== eastEntrances.length) {
          const cut1 = new THREE.Plane(new THREE.Vector3(0, 0, -1), (this.depth! / 2) - eastEntrances[i - 1].position - (ConstantHelper.entranceWidth / 2));
          const cut2 = new THREE.Plane(new THREE.Vector3(0, 0, 1), -(this.depth! / 2) + eastEntrances[i].position - (ConstantHelper.entranceWidth / 2));

          cuts.push(cut1);
          cuts.push(cut2);
        }
        else {
          const cut = new THREE.Plane(new THREE.Vector3(0, 0, -1), (this.depth! / 2) - eastEntrances[i - 1].position - (ConstantHelper.entranceWidth / 2));
          cuts.push(cut);
        }

        singleEastFence.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = child.material.clone();
            child.material.clippingPlanes = cuts;
            child.material.clipShadows = true;
          }
        });

        this.objects.push(singleEastFence);
        this.scene.add(singleEastFence);
      }
    }
  }

  private onWindowResize(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }

    this.renderer.render(this.scene, this.camera);
  }

  private setDefaultCameraSettings() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 5, -10);
    this.camera.lookAt(0, 0, 0);

    this.setOrbitControlsSettings();
  }

  private buildTestBorder(width: number, depth: number): void {
    const geometry = new THREE.BoxGeometry(width, 1, depth);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff73 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.copy(new THREE.Vector3(0, 0, 0));
    cube.castShadow = true;
    cube.receiveShadow = true;
    this.scene.add(cube);
    this.objects.push(cube);
  }

  private async loadFenceFromGTLF(width: number, depth: number, fence: Fence) {
    return new Promise<void>((resolve, reject) => {
      const loader: GLTFLoader = new GLTFLoader();
      loader.load(`../../assets/3d models/${fence.destination.folderName}/${fence.destination.fileName}`, (gltf) => {
        const originFence = gltf.scene.clone();

        const boundingBox: THREE.Box3 = new THREE.Box3().setFromObject(originFence);
        const size: THREE.Vector3 = new THREE.Vector3();
        boundingBox.getSize(size);

        const originalWidth: number = size.x;
        const originalHeight: number = size.y;
        const originalDepth: number = size.z;

        const scaleX: number = fence.width / originalWidth;
        const scaleY: number = fence.height / originalHeight;
        const scaleZ: number = fence.depth / originalDepth;

        originFence.scale.set(scaleX, scaleY, scaleZ);

        const fencesXNumber: number = width / fence.width;
        const fencesYNumber: number = depth / fence.width;

        let xPosition: number = -(width / 2) + (fence.width / 2);
        let yPosition: number = -(depth / 2) + (fence.width / 2);

        const yFrontPosition: number = depth / 2;
        const yBackPosition: number = -(depth / 2);

        const northFenceGroup = new THREE.Group();
        northFenceGroup.userData['type'] = 'north-fence-group';

        const southFenceGroup = new THREE.Group();
        southFenceGroup.userData['type'] = 'south-fence-group';

        const westFenceGroup = new THREE.Group();
        westFenceGroup.userData['type'] = 'west-fence-group';

        const eastFenceGroup = new THREE.Group();
        eastFenceGroup.userData['type'] = 'east-fence-group';

        for (let i = 0; i < fencesXNumber; i++) {
          const clippingPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), (width / 2));

          // note: front - south
          let singleFenceFront: THREE.Group<THREE.Object3DEventMap>;

          if (i == Math.floor(fencesXNumber) && fencesXNumber % 2 != 0) {
            singleFenceFront = gltf.scene.clone();
            singleFenceFront.scale.set(scaleX, scaleY, scaleZ);

            singleFenceFront.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material = child.material.clone();
                child.material.clippingPlanes = [clippingPlane];
                child.material.clipShadows = true;
              }
            });
          } else {
            singleFenceFront = originFence.clone();
          }

          singleFenceFront.rotation.y = Math.PI;
          singleFenceFront.position.set(xPosition, fence.positionZ, yBackPosition);

          singleFenceFront.userData['type'] = 'fence-south';
          southFenceGroup.add(singleFenceFront);

          // note: back - north
          let singleFenceBack;

          if (i == Math.floor(fencesXNumber) && fencesXNumber % 2 != 0) {
            singleFenceBack = gltf.scene.clone();
            singleFenceBack.scale.set(scaleX, scaleY, scaleZ);

            singleFenceBack.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material = child.material.clone();
                child.material.clippingPlanes = [clippingPlane];
                child.material.clipShadows = true;
              }
            });
          } else {
            singleFenceBack = originFence.clone();
          }

          singleFenceBack.position.set(xPosition, fence.positionZ, yFrontPosition);

          singleFenceBack.userData['type'] = 'fence-north';
          northFenceGroup.add(singleFenceBack);

          xPosition += fence.width;
        }

        for (let i = 0; i < fencesYNumber; i++) {
          const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), (depth / 2));

          // note: right - east
          let singleFenceRight2: THREE.Group<THREE.Object3DEventMap>;

          if (i == Math.floor(fencesYNumber) && fencesYNumber % 2 != 0) {
            singleFenceRight2 = gltf.scene.clone();
            singleFenceRight2.scale.set(scaleX, scaleY, scaleZ);

            singleFenceRight2.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material = child.material.clone();
                child.material.clippingPlanes = [clippingPlane];
                child.material.clipShadows = true;
              }
            });
          } else {
            singleFenceRight2 = originFence.clone();
          }

          singleFenceRight2.rotation.y = Math.PI + (Math.PI / 2);
          singleFenceRight2.position.set(-(width / 2), fence.positionZ, yPosition);

          singleFenceRight2.userData['type'] = 'fence-east';
          eastFenceGroup.add(singleFenceRight2);

          // note: left - east
          let singleFenceLeft: THREE.Group<THREE.Object3DEventMap>;

          if (i == Math.floor(fencesYNumber) && fencesYNumber % 2 != 0) {
            singleFenceLeft = gltf.scene.clone();
            singleFenceLeft.scale.set(scaleX, scaleY, scaleZ);

            singleFenceLeft.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material = child.material.clone();
                child.material.clippingPlanes = [clippingPlane];
                child.material.clipShadows = true;
              }
            });
          } else {
            singleFenceLeft = originFence.clone();
          }

          singleFenceLeft.rotation.y = (Math.PI / 2);
          singleFenceLeft.position.set(width / 2, fence.positionZ, yPosition);

          singleFenceLeft.userData['type'] = 'fence-west';
          westFenceGroup.add(singleFenceLeft);

          yPosition += fence.width;
        }

        this.scene.add(northFenceGroup);
        this.objects.push(northFenceGroup);
        this.noEntranceNorthFence = northFenceGroup;

        this.scene.add(southFenceGroup);
        this.objects.push(southFenceGroup);
        this.noEntranceSouthFence = southFenceGroup;

        this.scene.add(westFenceGroup);
        this.objects.push(westFenceGroup);
        this.noEntranceWestFence = westFenceGroup;

        this.scene.add(eastFenceGroup);
        this.objects.push(eastFenceGroup);
        this.noEntranceEastFence = eastFenceGroup;

        resolve();
      }, undefined, function (error) {
        console.error('Error loading fence model: ' + error);
        reject(error);
      });
    });
  }

  private async loadFenceFromOBJ(width: number, depth: number, fence: Fence) {
    return new Promise<void>((resolve, reject) => {
      const fileName: string = fence.destination.fileName.slice(0, -4);

      const loader: MTLLoader = new MTLLoader();
      loader.load(`../../assets/3d models/${fence.destination.folderName}/${fileName}.mtl`, (materials) => {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(`../../assets/3d models/${fence.destination.folderName}/${fileName}.obj`, (fenceModel) => {
          fenceModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material.needsUpdate = true;
            }
          });

          const originFence = fenceModel.clone();

          const boundingBox: THREE.Box3 = new THREE.Box3().setFromObject(originFence);
          const size: THREE.Vector3 = new THREE.Vector3();
          boundingBox.getSize(size);

          const originalWidth: number = size.x;
          const originalHeight: number = size.y;
          const originalDepth: number = size.z;

          const scaleX: number = fence.width / originalWidth;
          const scaleY: number = fence.height / originalHeight;
          const scaleZ: number = fence.depth / originalDepth;

          originFence.scale.set(scaleX, scaleY, scaleZ);

          const fencesXNumber: number = width / fence.width;
          const fencesYNumber: number = depth / fence.width;

          let xPosition: number = -(width / 2) + (fence.width / 2);
          let yPosition: number = -(depth / 2) + (fence.width / 2);

          const yFrontPosition: number = depth / 2;
          const yBackPosition: number = -(depth / 2);

          const northFenceGroup = new THREE.Group();
          northFenceGroup.userData['type'] = 'north-fence-group';

          const southFenceGroup = new THREE.Group();
          southFenceGroup.userData['type'] = 'south-fence-group';

          const westFenceGroup = new THREE.Group();
          westFenceGroup.userData['type'] = 'west-fence-group';

          const eastFenceGroup = new THREE.Group();
          eastFenceGroup.userData['type'] = 'east-fence-group';

          for (let i = 0; i < fencesXNumber; i++) {
            const clippingPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), (width / 2));

            // note: front - south
            let singleFenceFront: THREE.Group<THREE.Object3DEventMap>;

            if (i == Math.floor(fencesXNumber) && fencesXNumber % 2 != 0) {
              singleFenceFront = fenceModel.clone();
              singleFenceFront.scale.set(scaleX, scaleY, scaleZ);

              singleFenceFront.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.material = child.material.clone();
                  child.material.clippingPlanes = [clippingPlane];
                  child.material.clipShadows = true;
                }
              });
            } else {
              singleFenceFront = originFence.clone();
            }

            singleFenceFront.rotation.y = Math.PI;
            singleFenceFront.position.set(xPosition, fence.positionZ, yBackPosition);

            singleFenceFront.userData['type'] = 'fence-south';
            southFenceGroup.add(singleFenceFront);

            // note: back - north
            let singleFenceBack;

            if (i == Math.floor(fencesXNumber) && fencesXNumber % 2 != 0) {
              singleFenceBack = fenceModel.clone();
              singleFenceBack.scale.set(scaleX, scaleY, scaleZ);

              singleFenceBack.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.material = child.material.clone();
                  child.material.clippingPlanes = [clippingPlane];
                  child.material.clipShadows = true;
                }
              });
            } else {
              singleFenceBack = originFence.clone();
            }

            singleFenceBack.position.set(xPosition, fence.positionZ, yFrontPosition);

            singleFenceBack.userData['type'] = 'fence-north';
            northFenceGroup.add(singleFenceBack);

            xPosition += fence.width;
          }

          for (let i = 0; i < fencesYNumber; i++) {
            const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), (depth / 2));

            // note: right - east
            let singleFenceRight: THREE.Group<THREE.Object3DEventMap>;

            if (i == Math.floor(fencesYNumber) && fencesYNumber % 2 != 0) {
              singleFenceRight = fenceModel.clone();
              singleFenceRight.scale.set(scaleX, scaleY, scaleZ);

              singleFenceRight.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.material = child.material.clone();
                  child.material.clippingPlanes = [clippingPlane];
                  child.material.clipShadows = true;
                }
              });
            } else {
              singleFenceRight = originFence.clone();
            }

            singleFenceRight.rotation.y = Math.PI + (Math.PI / 2);
            singleFenceRight.position.set(-(width / 2), fence.positionZ, yPosition);

            singleFenceRight.userData['type'] = 'fence-east';
            eastFenceGroup.add(singleFenceRight);

            // note: left - east
            let singleFenceLeft: THREE.Group<THREE.Object3DEventMap>;

            if (i == Math.floor(fencesYNumber) && fencesYNumber % 2 != 0) {
              singleFenceLeft = fenceModel.clone();
              singleFenceLeft.scale.set(scaleX, scaleY, scaleZ);

              singleFenceLeft.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.material = child.material.clone();
                  child.material.clippingPlanes = [clippingPlane];
                  child.material.clipShadows = true;
                }
              });
            } else {
              singleFenceLeft = originFence.clone();
            }

            singleFenceLeft.rotation.y = (Math.PI / 2);
            singleFenceLeft.position.set(width / 2, fence.positionZ, yPosition);

            singleFenceLeft.userData['type'] = 'fence-west';
            westFenceGroup.add(singleFenceLeft);

            yPosition += fence.width;
          }

          this.scene.add(northFenceGroup);
          this.objects.push(northFenceGroup);
          this.noEntranceNorthFence = northFenceGroup;

          this.scene.add(southFenceGroup);
          this.objects.push(southFenceGroup);
          this.noEntranceSouthFence = southFenceGroup;

          this.scene.add(westFenceGroup);
          this.objects.push(westFenceGroup);
          this.noEntranceWestFence = westFenceGroup;

          this.scene.add(eastFenceGroup);
          this.objects.push(eastFenceGroup);
          this.noEntranceEastFence = eastFenceGroup;

          resolve();
        });
      }, undefined, function (error) {
        console.error('Error loading fence model: ' + error);
        reject(error);
      });
    });
  }

  private addTemporaryCompass(): void {
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);
  }
}
