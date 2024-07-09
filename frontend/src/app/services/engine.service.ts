import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

  private grassTexture!: THREE.Texture;

  constructor() { }

  public initialize(canvas: HTMLCanvasElement): void {
    this.renderer = new THREE.WebGLRenderer({ canvas });
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

  public addGrass(): void {
    const geometry = new THREE.PlaneGeometry(500, 500);
    const material = new THREE.MeshStandardMaterial({ map: this.grassTexture, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = - Math.PI / 2;
    plane.receiveShadow = true;
    this.scene.add(plane);
    this.objects.push(plane);
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

  public preloadGroundTexture(textureName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const loader = new THREE.TextureLoader();

      loader.load(`assets/textures/${textureName}.jpg`,
        (texture) => {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(200, 200);
          this.grassTexture = texture;
          resolve();
        },
        undefined,
        (error) => {
          console.error('Error loading texture:', error);
          reject(error);
        }
      );
    });
  }

  private setLightSettings(): void {
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Drugi parametr to intensywność
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
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

    const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.5);
    secondaryLight.position.set(-5, 10, -15);
    this.scene.add(secondaryLight);
  }

  private setCameraSettings() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 5, 10);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;
    this.controls.maxPolarAngle = Math.PI / 2;

    this.controls.minDistance = 5;
    this.controls.maxDistance = 50;
  }

  private addSky(): void {

    // sky link: https://opengameart.org/content/sky-box-sunny-day
    // TODO: change for another
    
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      'assets/textures/skybox/px.bmp', // right
      'assets/textures/skybox/nx.bmp', // left
      'assets/textures/skybox/py.bmp', // top
      'assets/textures/skybox/ny.bmp', // bottom
      'assets/textures/skybox/pz.bmp', // front
      'assets/textures/skybox/nz.bmp'  // back
    ]);

    this.scene.background = texture;
  }
}
