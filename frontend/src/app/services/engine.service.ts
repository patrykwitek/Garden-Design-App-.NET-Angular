import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThemeService } from './theme.service';

@Injectable({
  providedIn: 'root'
})
export class EngineService {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;

  private objects: THREE.Object3D[] = [];
  private isAnimating: boolean = false;

  private ground: THREE.Mesh | undefined;

  constructor(
    private themeService: ThemeService
  ) { }

  public initialize(canvas: HTMLCanvasElement): void {
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();

    this.setCameraSettings();
    this.setLightSettings();
    this.addSky();
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
  }

  public addTestCube(width: number, depth: number): void {
    // TODO: this is temporary method to test, delete it later

    const geometry = new THREE.BoxGeometry(width, 1, depth);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff73 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.copy(new THREE.Vector3(0, 0, 0));
    cube.castShadow = true;
    cube.receiveShadow = true;
    this.scene.add(cube);
    this.objects.push(cube);
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

    const loader = new THREE.TextureLoader();
    loader.load(`assets/textures/grounds/${textureName}.jpg`, (texture) => {
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

  public resetCameraPosition() {
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);

    this.controls.target.set(0, 0, 0);
    this.controls.update();
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

  private setCameraSettings() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = false;
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;
    this.controls.maxPolarAngle = (Math.PI / 2) - .005;

    this.controls.minDistance = 5;
    this.controls.maxDistance = 50;
  }
}
