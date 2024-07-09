import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class EngineService {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private objects: THREE.Object3D[] = [];
  private isAnimating: boolean = false;

  constructor() { }

  public initialize(canvas: HTMLCanvasElement): void {
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    const light = new THREE.AmbientLight(0x404040);
    this.scene.add(light);

    this.isAnimating = true;
    this.animate();
  }

  public addTestCubes(width: number): void {
    // TODO:
    // it's just test method to implement basic 3D visualisation
    // remove it later

    const cubesNumber = width / 10;

    for (let i = 0; i < cubesNumber; i++) {
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = (i * 2) - (cubesNumber - 1);
      this.scene.add(cube);
      this.objects.push(cube);
    }
  }

  public animate(): void {
    if (!this.isAnimating) {
      return;
    }

    requestAnimationFrame(() => this.animate());

    this.objects.forEach(obj => {
      obj.rotation.x += 0.01;
      obj.rotation.y += 0.01;
    });

    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.isAnimating = false;

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

    this.renderer.dispose();
    this.objects = [];
    this.scene = null!;
    this.camera = null!;
  }
}
