import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { ConstantHelper } from '../utils/constant-helper';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Injectable({
  providedIn: 'root'
})
export class CityGeneratorService {

  private width: number | undefined;
  private depth: number | undefined;
  private mirrorCamera: THREE.CubeCamera | undefined;

  private windowsColumn: THREE.Group | undefined;

  private textureLoader: THREE.TextureLoader = new THREE.TextureLoader();

  constructor() { }

  public createCityEnvironment(width: number, depth: number): { group: THREE.Group, mirrorCamera: THREE.CubeCamera } {
    this.width = width;
    this.depth = depth;

    const mirrorRenderTarget = new THREE.WebGLCubeRenderTarget(512, {
      format: THREE.RGBFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter
    });

    this.mirrorCamera = new THREE.CubeCamera(0.1, 1000, mirrorRenderTarget);
    this.mirrorCamera.position.set(0, 1, (this.depth! / 2) + (2 * ConstantHelper.cityStreetWidth));

    const cityGroup = new THREE.Group();
    cityGroup.userData['type'] = 'city-group';

    const sidewalkGroup = this.createSidewalk();
    cityGroup.add(sidewalkGroup);

    const grassGroup = this.createGrassForCity();
    cityGroup.add(grassGroup);

    const streetGroup = this.createStreetForCity();
    cityGroup.add(streetGroup);

    const buildingsGroup = this.createBuildingsForCity();
    cityGroup.add(buildingsGroup);

    const response: { group: THREE.Group, mirrorCamera: THREE.CubeCamera } = {
      group: cityGroup,
      mirrorCamera: this.mirrorCamera!
    }

    return response;
  }

  private createSidewalk(): THREE.Group {
    const sidewalkGroup = new THREE.Group();
    sidewalkGroup.userData['type'] = 'sidewalk-group';

    // sidewalk texture link: https://ambientcg.com/view?id=PavingStones037
    const sidewalkFrontRearTexture = this.textureLoader.load(`assets/textures/pavements/sidewalk.jpg`);

    sidewalkFrontRearTexture.wrapS = THREE.RepeatWrapping;
    sidewalkFrontRearTexture.wrapT = THREE.RepeatWrapping;

    sidewalkFrontRearTexture.repeat.set(this.width!, ConstantHelper.citySidewalkWidth);

    const frontRearGeometry = new THREE.BoxGeometry(this.width! + ConstantHelper.citySidewalkWidth, ConstantHelper.citySidewalkHeight, ConstantHelper.citySidewalkWidth);
    const frontRearMaterial = new THREE.MeshStandardMaterial({ map: sidewalkFrontRearTexture });

    const frontSidewalk = new THREE.Mesh(frontRearGeometry, frontRearMaterial);
    frontSidewalk.position.set(-ConstantHelper.citySidewalkWidth / 2, ConstantHelper.citySidewalkHeight / 2, (-this.depth! / 2) - (ConstantHelper.citySidewalkWidth / 2));
    frontSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(frontSidewalk);

    const rearSidewalk = new THREE.Mesh(frontRearGeometry, frontRearMaterial);
    rearSidewalk.position.set(ConstantHelper.citySidewalkWidth / 2, ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + (ConstantHelper.citySidewalkWidth / 2));
    rearSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(rearSidewalk);

    const sidewalkLeftRightTexture = this.textureLoader.load(`assets/textures/pavements/sidewalk.jpg`);

    sidewalkLeftRightTexture.wrapS = THREE.RepeatWrapping;
    sidewalkLeftRightTexture.wrapT = THREE.RepeatWrapping;

    sidewalkLeftRightTexture.repeat.set(ConstantHelper.citySidewalkWidth, this.depth!);

    const leftRightGeometry = new THREE.BoxGeometry(ConstantHelper.citySidewalkWidth, ConstantHelper.citySidewalkHeight, this.depth! + ConstantHelper.citySidewalkWidth);
    const leftRightMaterial = new THREE.MeshStandardMaterial({ map: sidewalkLeftRightTexture });

    const leftSidewalk = new THREE.Mesh(leftRightGeometry, leftRightMaterial);
    leftSidewalk.position.set((this.width! / 2) + (ConstantHelper.citySidewalkWidth / 2), ConstantHelper.citySidewalkHeight / 2, -(ConstantHelper.citySidewalkWidth / 2));
    leftSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(leftSidewalk);

    const rightSidewalk = new THREE.Mesh(leftRightGeometry, leftRightMaterial);
    rightSidewalk.position.set(-(this.width! / 2) - (ConstantHelper.citySidewalkWidth / 2), ConstantHelper.citySidewalkHeight / 2, (ConstantHelper.citySidewalkWidth / 2));
    rightSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(rightSidewalk);

    const sidewalkFrontRearOutsideTexture = this.textureLoader.load(`assets/textures/pavements/sidewalk.jpg`);

    sidewalkFrontRearOutsideTexture.wrapS = THREE.RepeatWrapping;
    sidewalkFrontRearOutsideTexture.wrapT = THREE.RepeatWrapping;

    sidewalkFrontRearOutsideTexture.repeat.set(this.width! + (2 * ConstantHelper.citySidewalkWidth), ConstantHelper.citySidewalkWidth);

    const frontRearOutsideGeometry = new THREE.BoxGeometry(this.width! + (2 * ConstantHelper.citySidewalkWidth), ConstantHelper.citySidewalkHeight, ConstantHelper.citySidewalkWidth);
    const frontRearOutsideMaterial = new THREE.MeshStandardMaterial({ map: sidewalkFrontRearOutsideTexture });

    const frontOutsideSidewalk = new THREE.Mesh(frontRearOutsideGeometry, frontRearOutsideMaterial);
    frontOutsideSidewalk.position.set(0, ConstantHelper.citySidewalkHeight / 2, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - (ConstantHelper.citySidewalkWidth / 2));
    frontOutsideSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(frontOutsideSidewalk);

    const rearOutsideSidewalk = new THREE.Mesh(frontRearOutsideGeometry, frontRearOutsideMaterial);
    rearOutsideSidewalk.position.set(0, ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + (ConstantHelper.citySidewalkWidth / 2));
    rearOutsideSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(rearOutsideSidewalk);

    const sidewalkLeftRightOutsideTexture = this.textureLoader.load(`assets/textures/pavements/sidewalk.jpg`);

    sidewalkLeftRightOutsideTexture.wrapS = THREE.RepeatWrapping;
    sidewalkLeftRightOutsideTexture.wrapT = THREE.RepeatWrapping;

    sidewalkLeftRightOutsideTexture.repeat.set(ConstantHelper.citySidewalkWidth, this.depth! + (2 * ConstantHelper.citySidewalkWidth));

    const leftRightOutsideGeometry = new THREE.BoxGeometry(ConstantHelper.citySidewalkWidth, ConstantHelper.citySidewalkHeight, this.depth! + (2 * ConstantHelper.citySidewalkWidth));
    const leftRightOutsideMaterial = new THREE.MeshStandardMaterial({ map: sidewalkLeftRightOutsideTexture });

    const leftOutsideSidewalk = new THREE.Mesh(leftRightOutsideGeometry, leftRightOutsideMaterial);
    leftOutsideSidewalk.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + (ConstantHelper.citySidewalkWidth / 2), ConstantHelper.citySidewalkHeight / 2, 0);
    leftOutsideSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(leftOutsideSidewalk);

    const rightOutsideSidewalk = new THREE.Mesh(leftRightOutsideGeometry, leftRightOutsideMaterial);
    rightOutsideSidewalk.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - (ConstantHelper.citySidewalkWidth / 2), ConstantHelper.citySidewalkHeight / 2, 0);
    rightOutsideSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(rightOutsideSidewalk);

    const sidewalkFrontRearOutsideExtensionTexture = this.textureLoader.load(`assets/textures/pavements/sidewalk.jpg`);

    sidewalkFrontRearOutsideExtensionTexture.wrapS = THREE.RepeatWrapping;
    sidewalkFrontRearOutsideExtensionTexture.wrapT = THREE.RepeatWrapping;

    sidewalkFrontRearOutsideExtensionTexture.repeat.set(ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth, ConstantHelper.citySidewalkWidth);

    const frontRearOutsideExtensionGeometry = new THREE.BoxGeometry(ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth, ConstantHelper.citySidewalkHeight, ConstantHelper.citySidewalkWidth);
    const frontRearOutsideExtensionMaterial = new THREE.MeshStandardMaterial({ map: sidewalkFrontRearOutsideExtensionTexture });

    const frontLeftOutsideExtensionSidewalk = new THREE.Mesh(frontRearOutsideExtensionGeometry, frontRearOutsideExtensionMaterial);
    frontLeftOutsideExtensionSidewalk.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth) / 2), ConstantHelper.citySidewalkHeight / 2, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - (ConstantHelper.citySidewalkWidth / 2));
    frontLeftOutsideExtensionSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(frontLeftOutsideExtensionSidewalk);

    const frontRightOutsideExtensionSidewalk = new THREE.Mesh(frontRearOutsideExtensionGeometry, frontRearOutsideExtensionMaterial);
    frontRightOutsideExtensionSidewalk.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth) / 2), ConstantHelper.citySidewalkHeight / 2, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - (ConstantHelper.citySidewalkWidth / 2));
    frontRightOutsideExtensionSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(frontRightOutsideExtensionSidewalk);

    const rearLeftOutsideExtensionSidewalk = new THREE.Mesh(frontRearOutsideExtensionGeometry, frontRearOutsideExtensionMaterial);
    rearLeftOutsideExtensionSidewalk.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth) / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + (ConstantHelper.citySidewalkWidth / 2));
    rearLeftOutsideExtensionSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(rearLeftOutsideExtensionSidewalk);

    const rearRightOutsideExtensionSidewalk = new THREE.Mesh(frontRearOutsideExtensionGeometry, frontRearOutsideExtensionMaterial);
    rearRightOutsideExtensionSidewalk.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth) / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + (ConstantHelper.citySidewalkWidth / 2));
    rearRightOutsideExtensionSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(rearRightOutsideExtensionSidewalk);

    const sidewalkLeftRightOutsideVerticalExtensionTexture = this.textureLoader.load(`assets/textures/pavements/sidewalk.jpg`);

    sidewalkLeftRightOutsideVerticalExtensionTexture.wrapS = THREE.RepeatWrapping;
    sidewalkLeftRightOutsideVerticalExtensionTexture.wrapT = THREE.RepeatWrapping;

    sidewalkLeftRightOutsideVerticalExtensionTexture.repeat.set(ConstantHelper.citySidewalkWidth, ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth);

    const leftRightOutsideVerticalExtensionGeometry = new THREE.BoxGeometry(ConstantHelper.citySidewalkWidth, ConstantHelper.citySidewalkHeight, ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth);
    const leftRightOutsideVerticalExtensionMaterial = new THREE.MeshStandardMaterial({ map: sidewalkLeftRightOutsideVerticalExtensionTexture });

    const leftFrontOutsideVerticalExtensionSidewalk = new THREE.Mesh(leftRightOutsideVerticalExtensionGeometry, leftRightOutsideVerticalExtensionMaterial);
    leftFrontOutsideVerticalExtensionSidewalk.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight / 2, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2));
    leftFrontOutsideVerticalExtensionSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(leftFrontOutsideVerticalExtensionSidewalk);

    const leftRearOutsideVerticalExtensionSidewalk = new THREE.Mesh(leftRightOutsideVerticalExtensionGeometry, leftRightOutsideVerticalExtensionMaterial);
    leftRearOutsideVerticalExtensionSidewalk.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2));
    leftRearOutsideVerticalExtensionSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(leftRearOutsideVerticalExtensionSidewalk);

    const rightFrontOutsideVerticalExtensionSidewalk = new THREE.Mesh(leftRightOutsideVerticalExtensionGeometry, leftRightOutsideVerticalExtensionMaterial);
    rightFrontOutsideVerticalExtensionSidewalk.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight / 2, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2));
    rightFrontOutsideVerticalExtensionSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(rightFrontOutsideVerticalExtensionSidewalk);

    const rightRearOutsideVerticalExtensionSidewalk = new THREE.Mesh(leftRightOutsideVerticalExtensionGeometry, leftRightOutsideVerticalExtensionMaterial);
    rightRearOutsideVerticalExtensionSidewalk.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2));
    rightRearOutsideVerticalExtensionSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(rightRearOutsideVerticalExtensionSidewalk);

    const leftFrontInsideVerticalExtensionSidewalk = new THREE.Mesh(leftRightOutsideVerticalExtensionGeometry, leftRightOutsideVerticalExtensionMaterial);
    leftFrontInsideVerticalExtensionSidewalk.position.set((this.width! / 2) + (ConstantHelper.citySidewalkWidth / 2), ConstantHelper.citySidewalkHeight / 2, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2));
    leftFrontInsideVerticalExtensionSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(leftFrontInsideVerticalExtensionSidewalk);

    const rightFrontInsideVerticalExtensionSidewalk = new THREE.Mesh(leftRightOutsideVerticalExtensionGeometry, leftRightOutsideVerticalExtensionMaterial);
    rightFrontInsideVerticalExtensionSidewalk.position.set(-(this.width! / 2) - (ConstantHelper.citySidewalkWidth / 2), ConstantHelper.citySidewalkHeight / 2, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2));
    rightFrontInsideVerticalExtensionSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(rightFrontInsideVerticalExtensionSidewalk);

    const leftRearInsideVerticalExtensionSidewalk = new THREE.Mesh(leftRightOutsideVerticalExtensionGeometry, leftRightOutsideVerticalExtensionMaterial);
    leftRearInsideVerticalExtensionSidewalk.position.set((this.width! / 2) + (ConstantHelper.citySidewalkWidth / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2));
    leftRearInsideVerticalExtensionSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(leftRearInsideVerticalExtensionSidewalk);

    const rightRearInsideVerticalExtensionSidewalk = new THREE.Mesh(leftRightOutsideVerticalExtensionGeometry, leftRightOutsideVerticalExtensionMaterial);
    rightRearInsideVerticalExtensionSidewalk.position.set(-(this.width! / 2) - (ConstantHelper.citySidewalkWidth / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2));
    rightRearInsideVerticalExtensionSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(rightRearInsideVerticalExtensionSidewalk);

    const middleSidewalkTexture = this.textureLoader.load(`assets/textures/pavements/sidewalk.jpg`);

    middleSidewalkTexture.wrapS = THREE.RepeatWrapping;
    middleSidewalkTexture.wrapT = THREE.RepeatWrapping;

    middleSidewalkTexture.repeat.set(ConstantHelper.cityStreetWidth - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth, ConstantHelper.citySidewalkWidth);

    const middleSidewalkGeometry = new THREE.BoxGeometry(ConstantHelper.cityStreetWidth - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth, ConstantHelper.citySidewalkHeight, ConstantHelper.citySidewalkWidth);
    const middleSidewalkMaterial = new THREE.MeshStandardMaterial({ map: middleSidewalkTexture });

    const leftFrontMiddleSidewalk = new THREE.Mesh(middleSidewalkGeometry, middleSidewalkMaterial);
    leftFrontMiddleSidewalk.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth) / 2), ConstantHelper.citySidewalkHeight / 2, (-this.depth! / 2) - (ConstantHelper.citySidewalkWidth / 2));
    leftFrontMiddleSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(leftFrontMiddleSidewalk);

    const leftRearMiddleSidewalk = new THREE.Mesh(middleSidewalkGeometry, middleSidewalkMaterial);
    leftRearMiddleSidewalk.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth) / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + (ConstantHelper.citySidewalkWidth / 2));
    leftRearMiddleSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(leftRearMiddleSidewalk);

    const rightFrontMiddleSidewalk = new THREE.Mesh(middleSidewalkGeometry, middleSidewalkMaterial);
    rightFrontMiddleSidewalk.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth) / 2), ConstantHelper.citySidewalkHeight / 2, (-this.depth! / 2) - (ConstantHelper.citySidewalkWidth / 2));
    rightFrontMiddleSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(rightFrontMiddleSidewalk);

    const rightRearMiddleSidewalk = new THREE.Mesh(middleSidewalkGeometry, middleSidewalkMaterial);
    rightRearMiddleSidewalk.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth) / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + (ConstantHelper.citySidewalkWidth / 2));
    rightRearMiddleSidewalk.userData['type'] = 'sidewalk';
    sidewalkGroup.add(rightRearMiddleSidewalk);

    const kerb = this.createKerbForCity();
    sidewalkGroup.add(kerb);

    return sidewalkGroup;
  }

  private createKerbForCity(): THREE.Group {
    const kerbGroup = new THREE.Group();
    kerbGroup.userData['type'] = 'kerb-group';

    const frontRearKerbTexture = this.textureLoader.load(`assets/textures/pavements/sidewalk.jpg`);

    frontRearKerbTexture.wrapS = THREE.RepeatWrapping;
    frontRearKerbTexture.wrapT = THREE.RepeatWrapping;

    frontRearKerbTexture.repeat.set(this.width!, ConstantHelper.cityKerbWidth);

    const frontRearKerbGeometry = new THREE.BoxGeometry(this.width! + (2 * ConstantHelper.citySidewalkWidth) + (2 * ConstantHelper.cityGrassWidth) + ConstantHelper.cityKerbWidth, ConstantHelper.citySidewalkHeight, ConstantHelper.cityKerbWidth);
    const frontRearKerbMaterial = new THREE.MeshStandardMaterial({ map: frontRearKerbTexture });

    const frontKerb = new THREE.Mesh(frontRearKerbGeometry, frontRearKerbMaterial);
    frontKerb.position.set(-(ConstantHelper.cityKerbWidth / 2), ConstantHelper.citySidewalkHeight / 2, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - (ConstantHelper.cityKerbWidth / 2));
    frontKerb.userData['type'] = 'kerb';
    kerbGroup.add(frontKerb);

    const rearKerb = new THREE.Mesh(frontRearKerbGeometry, frontRearKerbMaterial);
    rearKerb.position.set((ConstantHelper.cityKerbWidth / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + (ConstantHelper.cityKerbWidth / 2));
    rearKerb.userData['type'] = 'kerb';
    kerbGroup.add(rearKerb);

    const frontOutsideKerb = new THREE.Mesh(frontRearKerbGeometry, frontRearKerbMaterial);
    frontOutsideKerb.position.set(-(ConstantHelper.cityKerbWidth / 2), ConstantHelper.citySidewalkHeight / 2, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - (ConstantHelper.cityKerbWidth / 2));
    frontOutsideKerb.userData['type'] = 'kerb';
    kerbGroup.add(frontOutsideKerb);

    const rearOutsideKerb = new THREE.Mesh(frontRearKerbGeometry, frontRearKerbMaterial);
    rearOutsideKerb.position.set((ConstantHelper.cityKerbWidth / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityKerbWidth / 2));
    rearOutsideKerb.userData['type'] = 'kerb';
    kerbGroup.add(rearOutsideKerb);

    const leftRightKerbTexture = this.textureLoader.load(`assets/textures/pavements/sidewalk.jpg`);

    leftRightKerbTexture.wrapS = THREE.RepeatWrapping;
    leftRightKerbTexture.wrapT = THREE.RepeatWrapping;

    leftRightKerbTexture.repeat.set(ConstantHelper.cityKerbWidth, this.depth!);

    const leftRightKerbGeometry = new THREE.BoxGeometry(ConstantHelper.cityKerbWidth, ConstantHelper.citySidewalkHeight, this.depth! + (2 * ConstantHelper.citySidewalkWidth) + (2 * ConstantHelper.cityGrassWidth) + ConstantHelper.cityKerbWidth);
    const leftRightKerbMaterial = new THREE.MeshStandardMaterial({ map: leftRightKerbTexture });

    const leftKerb = new THREE.Mesh(leftRightKerbGeometry, leftRightKerbMaterial);
    leftKerb.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + (ConstantHelper.cityKerbWidth / 2), ConstantHelper.citySidewalkHeight / 2, -(ConstantHelper.cityKerbWidth / 2));
    leftKerb.userData['type'] = 'kerb';
    kerbGroup.add(leftKerb);

    const rightKerb = new THREE.Mesh(leftRightKerbGeometry, leftRightKerbMaterial);
    rightKerb.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - (ConstantHelper.cityKerbWidth / 2), ConstantHelper.citySidewalkHeight / 2, ConstantHelper.cityKerbWidth / 2);
    rightKerb.userData['type'] = 'kerb';
    kerbGroup.add(rightKerb);

    const leftOutsideKerb = new THREE.Mesh(leftRightKerbGeometry, leftRightKerbMaterial);
    leftOutsideKerb.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityKerbWidth / 2), ConstantHelper.citySidewalkHeight / 2, -(ConstantHelper.cityKerbWidth / 2));
    leftOutsideKerb.userData['type'] = 'kerb';
    kerbGroup.add(leftOutsideKerb);

    const rightOutsideKerb = new THREE.Mesh(leftRightKerbGeometry, leftRightKerbMaterial);
    rightOutsideKerb.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - (ConstantHelper.cityKerbWidth / 2), ConstantHelper.citySidewalkHeight / 2, ConstantHelper.cityKerbWidth / 2);
    rightOutsideKerb.userData['type'] = 'kerb';
    kerbGroup.add(rightOutsideKerb);

    const leftRightKerbExtensionTexture = this.textureLoader.load(`assets/textures/pavements/sidewalk.jpg`);

    leftRightKerbExtensionTexture.wrapS = THREE.RepeatWrapping;
    leftRightKerbExtensionTexture.wrapT = THREE.RepeatWrapping;

    leftRightKerbExtensionTexture.repeat.set(ConstantHelper.cityStreetWidth, ConstantHelper.cityKerbWidth);

    const leftRightKerbExtensionGeometry = new THREE.BoxGeometry(ConstantHelper.cityStreetWidth, ConstantHelper.citySidewalkHeight, ConstantHelper.cityKerbWidth);
    const leftRightKerbExtensionMaterial = new THREE.MeshStandardMaterial({ map: leftRightKerbExtensionTexture });

    const leftRearBackKerbExtension = new THREE.Mesh(leftRightKerbExtensionGeometry, leftRightKerbExtensionMaterial);
    leftRearBackKerbExtension.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityStreetWidth / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityKerbWidth / 2));
    leftRearBackKerbExtension.userData['type'] = 'kerb';
    kerbGroup.add(leftRearBackKerbExtension);

    const leftRearFrontKerbExtension = new THREE.Mesh(leftRightKerbExtensionGeometry, leftRightKerbExtensionMaterial);
    leftRearFrontKerbExtension.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityStreetWidth / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth - (ConstantHelper.cityKerbWidth / 2));
    leftRearFrontKerbExtension.userData['type'] = 'kerb';
    kerbGroup.add(leftRearFrontKerbExtension);

    const leftFrontBackKerbExtension = new THREE.Mesh(leftRightKerbExtensionGeometry, leftRightKerbExtensionMaterial);
    leftFrontBackKerbExtension.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityStreetWidth / 2), ConstantHelper.citySidewalkHeight / 2, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - (ConstantHelper.cityKerbWidth / 2));
    leftFrontBackKerbExtension.userData['type'] = 'kerb';
    kerbGroup.add(leftFrontBackKerbExtension);

    const leftFrontFrontKerbExtension = new THREE.Mesh(leftRightKerbExtensionGeometry, leftRightKerbExtensionMaterial);
    leftFrontFrontKerbExtension.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityStreetWidth / 2), ConstantHelper.citySidewalkHeight / 2, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth + (ConstantHelper.cityKerbWidth / 2));
    leftFrontFrontKerbExtension.userData['type'] = 'kerb';
    kerbGroup.add(leftFrontFrontKerbExtension);

    const rightRearBackKerbExtension = new THREE.Mesh(leftRightKerbExtensionGeometry, leftRightKerbExtensionMaterial);
    rightRearBackKerbExtension.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - (ConstantHelper.cityStreetWidth / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityKerbWidth / 2));
    rightRearBackKerbExtension.userData['type'] = 'kerb';
    kerbGroup.add(rightRearBackKerbExtension);

    const rightRearFrontKerbExtension = new THREE.Mesh(leftRightKerbExtensionGeometry, leftRightKerbExtensionMaterial);
    rightRearFrontKerbExtension.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - (ConstantHelper.cityStreetWidth / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth - (ConstantHelper.cityKerbWidth / 2));
    rightRearFrontKerbExtension.userData['type'] = 'kerb';
    kerbGroup.add(rightRearFrontKerbExtension);

    const rightFrontBackKerbExtension = new THREE.Mesh(leftRightKerbExtensionGeometry, leftRightKerbExtensionMaterial);
    rightFrontBackKerbExtension.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - (ConstantHelper.cityStreetWidth / 2), ConstantHelper.citySidewalkHeight / 2, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - (ConstantHelper.cityKerbWidth / 2));
    rightFrontBackKerbExtension.userData['type'] = 'kerb';
    kerbGroup.add(rightFrontBackKerbExtension);

    const rightFrontFrontKerbExtension = new THREE.Mesh(leftRightKerbExtensionGeometry, leftRightKerbExtensionMaterial);
    rightFrontFrontKerbExtension.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - (ConstantHelper.cityStreetWidth / 2), ConstantHelper.citySidewalkHeight / 2, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth + (ConstantHelper.cityKerbWidth / 2));
    rightFrontFrontKerbExtension.userData['type'] = 'kerb';
    kerbGroup.add(rightFrontFrontKerbExtension);

    const frontRearKerbExtensionTexture = this.textureLoader.load(`assets/textures/pavements/sidewalk.jpg`);

    frontRearKerbExtensionTexture.wrapS = THREE.RepeatWrapping;
    frontRearKerbExtensionTexture.wrapT = THREE.RepeatWrapping;

    frontRearKerbExtensionTexture.repeat.set(ConstantHelper.cityKerbWidth, ConstantHelper.cityStreetWidth);

    const frontRearKerbExtensionGeometry = new THREE.BoxGeometry(ConstantHelper.cityKerbWidth, ConstantHelper.citySidewalkHeight, ConstantHelper.cityStreetWidth);
    const frontRearKerbExtensionMaterial = new THREE.MeshStandardMaterial({ map: frontRearKerbExtensionTexture });

    const leftFrontLeftKerbExtension = new THREE.Mesh(frontRearKerbExtensionGeometry, frontRearKerbExtensionMaterial);
    leftFrontLeftKerbExtension.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityKerbWidth / 2), ConstantHelper.citySidewalkHeight / 2, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - (ConstantHelper.cityStreetWidth / 2));
    leftFrontLeftKerbExtension.userData['type'] = 'kerb';
    kerbGroup.add(leftFrontLeftKerbExtension);

    const leftFrontRightKerbExtension = new THREE.Mesh(frontRearKerbExtensionGeometry, frontRearKerbExtensionMaterial);
    leftFrontRightKerbExtension.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth - (ConstantHelper.cityKerbWidth / 2), ConstantHelper.citySidewalkHeight / 2, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - (ConstantHelper.cityStreetWidth / 2));
    leftFrontRightKerbExtension.userData['type'] = 'kerb';
    kerbGroup.add(leftFrontRightKerbExtension);

    const rightFrontLeftKerbExtension = new THREE.Mesh(frontRearKerbExtensionGeometry, frontRearKerbExtensionMaterial);
    rightFrontLeftKerbExtension.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - (ConstantHelper.cityKerbWidth / 2), ConstantHelper.citySidewalkHeight / 2, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - (ConstantHelper.cityStreetWidth / 2));
    rightFrontLeftKerbExtension.userData['type'] = 'kerb';
    kerbGroup.add(rightFrontLeftKerbExtension);

    const rightFrontRightKerbExtension = new THREE.Mesh(frontRearKerbExtensionGeometry, frontRearKerbExtensionMaterial);
    rightFrontRightKerbExtension.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth + (ConstantHelper.cityKerbWidth / 2), ConstantHelper.citySidewalkHeight / 2, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - (ConstantHelper.cityStreetWidth / 2));
    rightFrontRightKerbExtension.userData['type'] = 'kerb';
    kerbGroup.add(rightFrontRightKerbExtension);

    const leftRearLeftKerbExtension = new THREE.Mesh(frontRearKerbExtensionGeometry, frontRearKerbExtensionMaterial);
    leftRearLeftKerbExtension.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityKerbWidth / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityStreetWidth / 2));
    leftRearLeftKerbExtension.userData['type'] = 'kerb';
    kerbGroup.add(leftRearLeftKerbExtension);

    const leftRearRightKerbExtension = new THREE.Mesh(frontRearKerbExtensionGeometry, frontRearKerbExtensionMaterial);
    leftRearRightKerbExtension.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth - (ConstantHelper.cityKerbWidth / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityStreetWidth / 2));
    leftRearRightKerbExtension.userData['type'] = 'kerb';
    kerbGroup.add(leftRearRightKerbExtension);

    const rightRearLeftKerbExtension = new THREE.Mesh(frontRearKerbExtensionGeometry, frontRearKerbExtensionMaterial);
    rightRearLeftKerbExtension.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - (ConstantHelper.cityKerbWidth / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityStreetWidth / 2));
    rightRearLeftKerbExtension.userData['type'] = 'kerb';
    kerbGroup.add(rightRearLeftKerbExtension);

    const rightRearRightKerbExtension = new THREE.Mesh(frontRearKerbExtensionGeometry, frontRearKerbExtensionMaterial);
    rightRearRightKerbExtension.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth + (ConstantHelper.cityKerbWidth / 2), ConstantHelper.citySidewalkHeight / 2, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityStreetWidth / 2));
    rightRearRightKerbExtension.userData['type'] = 'kerb';
    kerbGroup.add(rightRearRightKerbExtension);

    return kerbGroup;
  }

  private createGrassForCity(): THREE.Group {
    const grassGroup = new THREE.Group();
    grassGroup.userData['type'] = 'grass-group';

    // grass 3d model: https://sketchfab.com/3d-models/low-poly-cartoon-grass-84834a633e6b4d11aa3597666ee6945f
    const loader: GLTFLoader = new GLTFLoader();
    loader.load(`../../assets/3d models/grass/grass.gltf`, (gltf) => {
      const originGrass = gltf.scene;

      const boundingBox: THREE.Box3 = new THREE.Box3().setFromObject(originGrass);
      const size: THREE.Vector3 = new THREE.Vector3();
      boundingBox.getSize(size);

      const scaleX: number = (ConstantHelper.cityGrassWidth * .8) / size.x;
      const scaleY: number = ConstantHelper.cityGrassHeight / size.y;
      const scaleZ: number = ConstantHelper.cityGrassDepth / size.z;
      originGrass.scale.set(scaleX, scaleY, scaleZ);

      const horizontalGrassNumber: number = (this.width! + (2 * ConstantHelper.citySidewalkWidth) + ConstantHelper.cityGrassWidth) / ConstantHelper.cityGrassDepth;
      let horizontalPositionX: number = (this.width! / 2) + ConstantHelper.citySidewalkWidth - (ConstantHelper.cityGrassDepth / 2);

      for (let i = 0; i < horizontalGrassNumber; i++) {
        let frontGrassClone: THREE.Group<THREE.Object3DEventMap>;
        const frontClippingPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), (this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth);

        if (i == Math.floor(horizontalGrassNumber)) {
          frontGrassClone = gltf.scene.clone();
          frontGrassClone.scale.set(scaleX, scaleY, scaleZ);

          frontGrassClone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = child.material.clone();
              child.material.clippingPlanes = [frontClippingPlane];
              child.material.clipShadows = true;
            }
          });
        } else {
          frontGrassClone = originGrass.clone();
        }

        frontGrassClone.position.set(horizontalPositionX, ConstantHelper.citySidewalkHeight - .02, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - (ConstantHelper.cityGrassWidth / 2));
        frontGrassClone.rotation.y = Math.PI / 2;
        frontGrassClone.userData['type'] = 'grass';

        grassGroup.add(frontGrassClone);

        let rearGrassClone: THREE.Group<THREE.Object3DEventMap>;
        const rearClippingPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), (this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth);

        if (i == Math.floor(horizontalGrassNumber)) {
          rearGrassClone = gltf.scene.clone();
          rearGrassClone.scale.set(scaleX, scaleY, scaleZ);

          rearGrassClone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = child.material.clone();
              child.material.clippingPlanes = [rearClippingPlane];
              child.material.clipShadows = true;
            }
          });
        } else {
          rearGrassClone = originGrass.clone();
        }

        rearGrassClone.position.set(-horizontalPositionX, ConstantHelper.citySidewalkHeight - .02, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + (ConstantHelper.cityGrassWidth / 2));
        rearGrassClone.rotation.y = Math.PI / 2;
        rearGrassClone.userData['type'] = 'grass';

        grassGroup.add(rearGrassClone);

        horizontalPositionX -= ConstantHelper.cityGrassDepth;
      }

      const verticalGrassNumber: number = (this.depth! + (2 * ConstantHelper.citySidewalkWidth) + ConstantHelper.cityGrassWidth) / ConstantHelper.cityGrassDepth;
      let verticalPositionY: number = (this.depth! / 2) + ConstantHelper.citySidewalkWidth - (ConstantHelper.cityGrassDepth / 2);

      for (let i = 0; i < verticalGrassNumber; i++) {
        let leftGrassClone: THREE.Group<THREE.Object3DEventMap>;
        const leftClippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth);

        if (i == Math.floor(verticalGrassNumber)) {
          leftGrassClone = gltf.scene.clone();
          leftGrassClone.scale.set(scaleX, scaleY, scaleZ);

          leftGrassClone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = child.material.clone();
              child.material.clippingPlanes = [leftClippingPlane];
              child.material.clipShadows = true;
            }
          });
        } else {
          leftGrassClone = originGrass.clone();
        }

        leftGrassClone.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + (ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .02, verticalPositionY);
        leftGrassClone.userData['type'] = 'grass';

        grassGroup.add(leftGrassClone);

        let rightGrassClone: THREE.Group<THREE.Object3DEventMap>;
        const rightClippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth);

        if (i == Math.floor(verticalGrassNumber)) {
          rightGrassClone = gltf.scene.clone();
          rightGrassClone.scale.set(scaleX, scaleY, scaleZ);

          rightGrassClone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = child.material.clone();
              child.material.clippingPlanes = [rightClippingPlane];
              child.material.clipShadows = true;
            }
          });
        } else {
          rightGrassClone = originGrass.clone();
        }

        rightGrassClone.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - (ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .02, -verticalPositionY);
        rightGrassClone.userData['type'] = 'grass';

        grassGroup.add(rightGrassClone);

        verticalPositionY -= ConstantHelper.cityGrassDepth;
      }

      const horizontalMiddleOutsideGrassNumber: number = (this.width! + (2 * ConstantHelper.citySidewalkWidth) + (2 * ConstantHelper.cityGrassWidth)) / ConstantHelper.cityGrassDepth;
      let horizontalMiddleOutsidePositionX: number = (this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth - .1 - (ConstantHelper.cityGrassDepth / 2);

      for (let i = 0; i < horizontalMiddleOutsideGrassNumber; i++) {
        let frontGrassClone: THREE.Group<THREE.Object3DEventMap>;
        const frontClippingPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), (this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth);

        if (i == Math.floor(horizontalMiddleOutsideGrassNumber)) {
          frontGrassClone = gltf.scene.clone();
          frontGrassClone.scale.set(scaleX, scaleY, scaleZ);

          frontGrassClone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = child.material.clone();
              child.material.clippingPlanes = [frontClippingPlane];
              child.material.clipShadows = true;
            }
          });
        } else {
          frontGrassClone = originGrass.clone();
        }

        frontGrassClone.position.set(horizontalMiddleOutsidePositionX, ConstantHelper.citySidewalkHeight - .02, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityGrassWidth / 2));
        frontGrassClone.rotation.y = Math.PI / 2;
        frontGrassClone.userData['type'] = 'grass';

        grassGroup.add(frontGrassClone);

        let rearGrassClone: THREE.Group<THREE.Object3DEventMap>;
        const rearClippingPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), (this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth);

        if (i == Math.floor(horizontalMiddleOutsideGrassNumber)) {
          rearGrassClone = gltf.scene.clone();
          rearGrassClone.scale.set(scaleX, scaleY, scaleZ);

          rearGrassClone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = child.material.clone();
              child.material.clippingPlanes = [rearClippingPlane];
              child.material.clipShadows = true;
            }
          });
        } else {
          rearGrassClone = originGrass.clone();
        }

        rearGrassClone.position.set(horizontalMiddleOutsidePositionX, ConstantHelper.citySidewalkHeight - .02, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityGrassWidth / 2));
        rearGrassClone.rotation.y = Math.PI / 2;
        rearGrassClone.userData['type'] = 'grass';

        grassGroup.add(rearGrassClone);

        horizontalMiddleOutsidePositionX -= ConstantHelper.cityGrassDepth;
      }

      const verticalMiddleOutsideGrassNumber: number = (this.depth! + (2 * ConstantHelper.citySidewalkWidth) + (2 * ConstantHelper.cityGrassWidth)) / ConstantHelper.cityGrassDepth;
      let verticalMiddleOutsidePositionY: number = (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth - .1 - (ConstantHelper.cityGrassDepth / 2);

      for (let i = 0; i < verticalMiddleOutsideGrassNumber; i++) {
        let leftGrassClone: THREE.Group<THREE.Object3DEventMap>;
        const leftClippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth);

        if (i >= Math.floor(verticalMiddleOutsideGrassNumber) - 1) {
          leftGrassClone = gltf.scene.clone();
          leftGrassClone.scale.set(scaleX, scaleY, scaleZ);

          leftGrassClone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = child.material.clone();
              child.material.clippingPlanes = [leftClippingPlane];
              child.material.clipShadows = true;
            }
          });
        } else {
          leftGrassClone = originGrass.clone();
        }

        leftGrassClone.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .02, -verticalMiddleOutsidePositionY);
        leftGrassClone.userData['type'] = 'grass';

        grassGroup.add(leftGrassClone);

        let rightGrassClone: THREE.Group<THREE.Object3DEventMap>;
        const rightClippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth);

        if (i >= Math.floor(verticalMiddleOutsideGrassNumber) - 1) {
          rightGrassClone = gltf.scene.clone();
          rightGrassClone.scale.set(scaleX, scaleY, scaleZ);

          rightGrassClone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = child.material.clone();
              child.material.clippingPlanes = [rightClippingPlane];
              child.material.clipShadows = true;
            }
          });
        } else {
          rightGrassClone = originGrass.clone();
        }

        rightGrassClone.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .02, -verticalMiddleOutsidePositionY);
        rightGrassClone.userData['type'] = 'grass';

        grassGroup.add(rightGrassClone);

        verticalMiddleOutsidePositionY -= ConstantHelper.cityGrassDepth;
      }

      const leftHorizontalExtensionOutsideGrass: THREE.Group = new THREE.Group();
      leftHorizontalExtensionOutsideGrass.userData['type'] = 'grass-group';

      const rightHorizontalExtensionOutsideGrass: THREE.Group = new THREE.Group();
      rightHorizontalExtensionOutsideGrass.userData['type'] = 'grass-group';

      const outsideGrassNumber: number = (ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth) / ConstantHelper.cityGrassDepth;
      let horizontalExtensionOutsidePositionX: number = ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth) / 2);

      for (let i = 0; i < outsideGrassNumber; i++) {
        let leftGrassClone: THREE.Group<THREE.Object3DEventMap>;
        let rightGrassClone: THREE.Group<THREE.Object3DEventMap>;

        const leftClippingPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth);
        const rightClippingPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), (this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityStreetWidth);

        if (i >= Math.floor(outsideGrassNumber) - 1) {
          leftGrassClone = gltf.scene.clone();
          leftGrassClone.scale.set(scaleX, scaleY, scaleZ);

          leftGrassClone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = child.material.clone();
              child.material.clippingPlanes = [leftClippingPlane];
              child.material.clipShadows = true;
            }
          });

          rightGrassClone = gltf.scene.clone();
          rightGrassClone.scale.set(scaleX, scaleY, scaleZ);

          rightGrassClone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = child.material.clone();
              child.material.clippingPlanes = [rightClippingPlane];
              child.material.clipShadows = true;
            }
          });
        } else {
          leftGrassClone = originGrass.clone();
          rightGrassClone = originGrass.clone();
        }

        leftGrassClone.position.set(horizontalExtensionOutsidePositionX, ConstantHelper.citySidewalkHeight - .02, 0);
        leftGrassClone.rotation.y = Math.PI / 2;
        leftGrassClone.userData['type'] = 'grass';

        rightGrassClone.position.set(horizontalExtensionOutsidePositionX, ConstantHelper.citySidewalkHeight - .02, 0);
        rightGrassClone.rotation.y = Math.PI / 2;
        rightGrassClone.userData['type'] = 'grass';

        leftHorizontalExtensionOutsideGrass.add(leftGrassClone);
        rightHorizontalExtensionOutsideGrass.add(rightGrassClone);

        horizontalExtensionOutsidePositionX -= ConstantHelper.cityGrassDepth;
      }

      const leftRearHorizontalExtensionOutsideGrass = leftHorizontalExtensionOutsideGrass.clone();
      leftRearHorizontalExtensionOutsideGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityStreetWidth / 2) - .1, 0, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityGrassWidth / 2));
      grassGroup.add(leftRearHorizontalExtensionOutsideGrass);

      const leftRearMiddleHorizontalExtensionOutsideGrass = leftHorizontalExtensionOutsideGrass.clone();
      leftRearMiddleHorizontalExtensionOutsideGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityStreetWidth / 2) - .1, 0, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + (ConstantHelper.cityGrassWidth / 2));
      grassGroup.add(leftRearMiddleHorizontalExtensionOutsideGrass);

      const leftFrontHorizontalExtensionOutsideGrass = leftHorizontalExtensionOutsideGrass.clone();
      leftFrontHorizontalExtensionOutsideGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityStreetWidth / 2) - .1, 0, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityGrassWidth / 2));
      grassGroup.add(leftFrontHorizontalExtensionOutsideGrass);

      const leftFrontMiddleHorizontalExtensionOutsideGrass = leftHorizontalExtensionOutsideGrass.clone();
      leftFrontMiddleHorizontalExtensionOutsideGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityStreetWidth / 2) - .1, 0, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - (ConstantHelper.cityGrassWidth / 2));
      grassGroup.add(leftFrontMiddleHorizontalExtensionOutsideGrass);

      const rightRearHorizontalExtensionOutsideGrass = rightHorizontalExtensionOutsideGrass.clone();
      rightRearHorizontalExtensionOutsideGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth) / 2) - .1, 0, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityGrassWidth / 2));
      grassGroup.add(rightRearHorizontalExtensionOutsideGrass);

      const rightRearMiddleHorizontalExtensionOutsideGrass = rightHorizontalExtensionOutsideGrass.clone();
      rightRearMiddleHorizontalExtensionOutsideGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth) / 2) - .1, 0, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + (ConstantHelper.cityGrassWidth / 2));
      grassGroup.add(rightRearMiddleHorizontalExtensionOutsideGrass);

      const rightFrontHorizontalExtensionOutsideGrass = rightHorizontalExtensionOutsideGrass.clone();
      rightFrontHorizontalExtensionOutsideGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth) / 2) - .1, 0, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityGrassWidth / 2));
      grassGroup.add(rightFrontHorizontalExtensionOutsideGrass);

      const rightFrontMiddleHorizontalExtensionOutsideGrass = rightHorizontalExtensionOutsideGrass.clone();
      rightFrontMiddleHorizontalExtensionOutsideGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth) / 2) - .1, 0, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - (ConstantHelper.cityGrassWidth / 2));
      grassGroup.add(rightFrontMiddleHorizontalExtensionOutsideGrass);

      const frontHorizontalExtensionOutsideGrass: THREE.Group = new THREE.Group();
      frontHorizontalExtensionOutsideGrass.userData['type'] = 'grass-group';

      const rearHorizontalExtensionOutsideGrass: THREE.Group = new THREE.Group();
      rearHorizontalExtensionOutsideGrass.userData['type'] = 'grass-group';

      let horizontalVerticalOutsidePositionY: number = -((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth) / 2);

      for (let i = 0; i < outsideGrassNumber; i++) {
        let frontGrassClone: THREE.Group<THREE.Object3DEventMap>;
        let rearGrassClone: THREE.Group<THREE.Object3DEventMap>;

        const frontClippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityStreetWidth);
        const rearClippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth);

        if (i == 0) {
          frontGrassClone = gltf.scene.clone();
          frontGrassClone.scale.set(scaleX, scaleY, scaleZ);

          frontGrassClone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = child.material.clone();
              child.material.clippingPlanes = [frontClippingPlane];
              child.material.clipShadows = true;
            }
          });

          rearGrassClone = gltf.scene.clone();
          rearGrassClone.scale.set(scaleX, scaleY, scaleZ);

          rearGrassClone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = child.material.clone();
              child.material.clippingPlanes = [rearClippingPlane];
              child.material.clipShadows = true;
            }
          });
        } else {
          frontGrassClone = originGrass.clone();
          rearGrassClone = originGrass.clone();
        }

        frontGrassClone.position.set(0, ConstantHelper.citySidewalkHeight - .02, horizontalVerticalOutsidePositionY);
        frontGrassClone.userData['type'] = 'grass';

        frontHorizontalExtensionOutsideGrass.add(frontGrassClone);

        rearGrassClone.position.set(0, ConstantHelper.citySidewalkHeight - .02, horizontalVerticalOutsidePositionY);
        rearGrassClone.userData['type'] = 'grass';

        rearHorizontalExtensionOutsideGrass.add(rearGrassClone);

        horizontalVerticalOutsidePositionY += ConstantHelper.cityGrassDepth;
      }

      const frontLeftHorizontalExtensionOutsideGrass = frontHorizontalExtensionOutsideGrass.clone();
      frontLeftHorizontalExtensionOutsideGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + (ConstantHelper.cityGrassWidth / 2), 0, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth + .1 - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth) / 2));
      grassGroup.add(frontLeftHorizontalExtensionOutsideGrass);

      const frontRightHorizontalExtensionOutsideGrass = frontHorizontalExtensionOutsideGrass.clone();
      frontRightHorizontalExtensionOutsideGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - (ConstantHelper.cityGrassWidth / 2), 0, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth + .1 - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth) / 2));
      grassGroup.add(frontRightHorizontalExtensionOutsideGrass);

      const rearLeftHorizontalExtensionOutsideGrass = rearHorizontalExtensionOutsideGrass.clone();
      rearLeftHorizontalExtensionOutsideGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + (ConstantHelper.cityGrassWidth / 2), 0, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth) / 2));
      grassGroup.add(rearLeftHorizontalExtensionOutsideGrass);

      const rearRightHorizontalExtensionOutsideGrass = rearHorizontalExtensionOutsideGrass.clone();
      rearRightHorizontalExtensionOutsideGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - (ConstantHelper.cityGrassWidth / 2), 0, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth) / 2));
      grassGroup.add(rearRightHorizontalExtensionOutsideGrass);

      const frontLongOutsideGrass: THREE.Group = new THREE.Group();
      frontLongOutsideGrass.userData['type'] = 'grass-group';

      const rearLongOutsideGrass: THREE.Group = new THREE.Group();
      rearLongOutsideGrass.userData['type'] = 'grass-group';

      const longGrassNumber: number = (ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth) / ConstantHelper.cityGrassDepth;
      let longOutsidePositionY: number = -((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth) / 2);

      for (let i = 0; i < longGrassNumber; i++) {
        let frontGrassClone: THREE.Group<THREE.Object3DEventMap>;
        let rearGrassClone: THREE.Group<THREE.Object3DEventMap>;

        const frontClippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityStreetWidth);
        const rearClippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth);

        if (i == 0) {
          frontGrassClone = gltf.scene.clone();
          frontGrassClone.scale.set(scaleX, scaleY, scaleZ);

          frontGrassClone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = child.material.clone();
              child.material.clippingPlanes = [frontClippingPlane];
              child.material.clipShadows = true;
            }
          });

          rearGrassClone = gltf.scene.clone();
          rearGrassClone.scale.set(scaleX, scaleY, scaleZ);

          rearGrassClone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = child.material.clone();
              child.material.clippingPlanes = [rearClippingPlane];
              child.material.clipShadows = true;
            }
          });
        } else {
          frontGrassClone = originGrass.clone();
          rearGrassClone = originGrass.clone();
        }

        frontGrassClone.position.set(0, ConstantHelper.citySidewalkHeight - .02, longOutsidePositionY);
        frontGrassClone.userData['type'] = 'grass';

        frontLongOutsideGrass.add(frontGrassClone);

        rearGrassClone.position.set(0, ConstantHelper.citySidewalkHeight - .02, longOutsidePositionY);
        rearGrassClone.userData['type'] = 'grass';

        rearLongOutsideGrass.add(rearGrassClone);

        longOutsidePositionY += ConstantHelper.cityGrassDepth;
      }

      const frontLeftLongOutsideGrass = frontLongOutsideGrass.clone();
      frontLeftLongOutsideGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityGrassWidth / 2), 0, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - .2 - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth) / 2));
      grassGroup.add(frontLeftLongOutsideGrass);

      const frontRightLongOutsideGrass = frontLongOutsideGrass.clone();
      frontRightLongOutsideGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityGrassWidth / 2), 0, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - .2 - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth) / 2));
      grassGroup.add(frontRightLongOutsideGrass);

      const rearLeftLongOutsideGrass = rearLongOutsideGrass.clone();
      rearLeftLongOutsideGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityGrassWidth / 2), 0, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + .2 + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth) / 2));
      grassGroup.add(rearLeftLongOutsideGrass);

      const rearRightLongOutsideGrass = rearLongOutsideGrass.clone();
      rearRightLongOutsideGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityGrassWidth / 2), 0, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + .2 + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth) / 2));
      grassGroup.add(rearRightLongOutsideGrass);
    });

    // city grass texture link: https://ambientcg.com/view?id=Grass002
    const frontRearCityGrass = this.textureLoader.load(`assets/textures/grounds/city-grass.jpg`);

    frontRearCityGrass.wrapS = THREE.RepeatWrapping;
    frontRearCityGrass.wrapT = THREE.RepeatWrapping;

    frontRearCityGrass.repeat.set(this.width!, ConstantHelper.cityGrassWidth);

    const frontRearGrassGeometry = new THREE.PlaneGeometry(this.width! + (2 * ConstantHelper.citySidewalkWidth) + ConstantHelper.cityGrassWidth, ConstantHelper.cityGrassWidth);
    const frontRearGrassMaterial = new THREE.MeshStandardMaterial({ map: frontRearCityGrass, side: THREE.FrontSide });

    const frontGrass = new THREE.Mesh(frontRearGrassGeometry, frontRearGrassMaterial);
    frontGrass.rotation.x = -Math.PI / 2;
    frontGrass.position.set(-(ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .01, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - (ConstantHelper.cityGrassWidth / 2));
    frontGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(frontGrass);

    const rearGrass = new THREE.Mesh(frontRearGrassGeometry, frontRearGrassMaterial);
    rearGrass.rotation.x = -Math.PI / 2;
    rearGrass.position.set((ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + (ConstantHelper.cityGrassWidth / 2));
    rearGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(rearGrass);

    const frontRearOutsideCityGrass = this.textureLoader.load(`assets/textures/grounds/city-grass.jpg`);

    frontRearOutsideCityGrass.wrapS = THREE.RepeatWrapping;
    frontRearOutsideCityGrass.wrapT = THREE.RepeatWrapping;

    frontRearOutsideCityGrass.repeat.set(this.width!, ConstantHelper.cityGrassWidth);

    const frontRearOutsideGrassGeometry = new THREE.PlaneGeometry(this.width! + (2 * ConstantHelper.citySidewalkWidth) + (2 * ConstantHelper.cityGrassWidth), ConstantHelper.cityGrassWidth);
    const frontRearOutsideGrassMaterial = new THREE.MeshStandardMaterial({ map: frontRearCityGrass, side: THREE.FrontSide });

    const frontOutsideGrass = new THREE.Mesh(frontRearOutsideGrassGeometry, frontRearOutsideGrassMaterial);
    frontOutsideGrass.rotation.x = -Math.PI / 2;
    frontOutsideGrass.position.set(0, ConstantHelper.citySidewalkHeight - .01, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityGrassWidth / 2));
    frontOutsideGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(frontOutsideGrass);

    const rearOutsideGrass = new THREE.Mesh(frontRearOutsideGrassGeometry, frontRearOutsideGrassMaterial);
    rearOutsideGrass.rotation.x = -Math.PI / 2;
    rearOutsideGrass.position.set(0, ConstantHelper.citySidewalkHeight - .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityGrassWidth / 2));
    rearOutsideGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(rearOutsideGrass);

    const leftRightCityGrass = this.textureLoader.load(`assets/textures/grounds/city-grass.jpg`);

    leftRightCityGrass.wrapS = THREE.RepeatWrapping;
    leftRightCityGrass.wrapT = THREE.RepeatWrapping;

    leftRightCityGrass.repeat.set(ConstantHelper.cityGrassWidth, this.depth!);

    const leftRightGrassGeometry = new THREE.PlaneGeometry(ConstantHelper.cityGrassWidth, this.depth! + (2 * ConstantHelper.citySidewalkWidth) + ConstantHelper.cityGrassWidth);
    const leftRightGrassMaterial = new THREE.MeshStandardMaterial({ map: leftRightCityGrass, side: THREE.FrontSide });

    const leftGrass = new THREE.Mesh(leftRightGrassGeometry, leftRightGrassMaterial);
    leftGrass.rotation.x = -Math.PI / 2;
    leftGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + (ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .01, -(ConstantHelper.cityGrassWidth / 2));
    leftGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(leftGrass);

    const rightGrass = new THREE.Mesh(leftRightGrassGeometry, leftRightGrassMaterial);
    rightGrass.rotation.x = -Math.PI / 2;
    rightGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - (ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .01, ConstantHelper.cityGrassWidth / 2);
    rightGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(rightGrass);

    const leftRightOutsideGrass = this.textureLoader.load(`assets/textures/grounds/city-grass.jpg`);

    leftRightOutsideGrass.wrapS = THREE.RepeatWrapping;
    leftRightOutsideGrass.wrapT = THREE.RepeatWrapping;

    leftRightOutsideGrass.repeat.set(ConstantHelper.cityGrassWidth, this.depth!);

    const leftRightOutsideGrassGeometry = new THREE.PlaneGeometry(ConstantHelper.cityGrassWidth, this.depth! + (2 * ConstantHelper.citySidewalkWidth) + (2 * ConstantHelper.cityGrassWidth));
    const leftRightOutsideGrassMaterial = new THREE.MeshStandardMaterial({ map: leftRightOutsideGrass, side: THREE.FrontSide });

    const leftOutsideGrass = new THREE.Mesh(leftRightOutsideGrassGeometry, leftRightOutsideGrassMaterial);
    leftOutsideGrass.rotation.x = -Math.PI / 2;
    leftOutsideGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .01, 0);
    leftOutsideGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(leftOutsideGrass);

    const rightOutsideGrass = new THREE.Mesh(leftRightOutsideGrassGeometry, leftRightOutsideGrassMaterial);
    rightOutsideGrass.rotation.x = -Math.PI / 2;
    rightOutsideGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .01, 0);
    rightOutsideGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(rightOutsideGrass);

    const leftRightOutsideExtensionGrass = this.textureLoader.load(`assets/textures/grounds/city-grass.jpg`);

    leftRightOutsideExtensionGrass.wrapS = THREE.RepeatWrapping;
    leftRightOutsideExtensionGrass.wrapT = THREE.RepeatWrapping;

    leftRightOutsideExtensionGrass.repeat.set(ConstantHelper.cityGrassWidth, ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth);

    const leftRightOutsideExtensionGrassGeometry = new THREE.PlaneGeometry(ConstantHelper.cityGrassWidth, ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth);
    const leftRightOutsideExtensionGrassMaterial = new THREE.MeshStandardMaterial({ map: leftRightOutsideExtensionGrass, side: THREE.FrontSide });

    const leftRearOutsideExtensionGrass = new THREE.Mesh(leftRightOutsideExtensionGrassGeometry, leftRightOutsideExtensionGrassMaterial);
    leftRearOutsideExtensionGrass.rotation.x = -Math.PI / 2;
    leftRearOutsideExtensionGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth) / 2));
    leftRearOutsideExtensionGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(leftRearOutsideExtensionGrass);

    const leftFrontOutsideExtensionGrass = new THREE.Mesh(leftRightOutsideExtensionGrassGeometry, leftRightOutsideExtensionGrassMaterial);
    leftFrontOutsideExtensionGrass.rotation.x = -Math.PI / 2;
    leftFrontOutsideExtensionGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .01, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth) / 2));
    leftFrontOutsideExtensionGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(leftFrontOutsideExtensionGrass);

    const rightRearOutsideExtensionGrass = new THREE.Mesh(leftRightOutsideExtensionGrassGeometry, leftRightOutsideExtensionGrassMaterial);
    rightRearOutsideExtensionGrass.rotation.x = -Math.PI / 2;
    rightRearOutsideExtensionGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth) / 2));
    rightRearOutsideExtensionGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(rightRearOutsideExtensionGrass);

    const rightFrontOutsideExtensionGrass = new THREE.Mesh(leftRightOutsideExtensionGrassGeometry, leftRightOutsideExtensionGrassMaterial);
    rightFrontOutsideExtensionGrass.rotation.x = -Math.PI / 2;
    rightFrontOutsideExtensionGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .01, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth) / 2));
    rightFrontOutsideExtensionGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(rightFrontOutsideExtensionGrass);

    const leftRightInsideExtensionGrass = this.textureLoader.load(`assets/textures/grounds/city-grass.jpg`);

    leftRightInsideExtensionGrass.wrapS = THREE.RepeatWrapping;
    leftRightInsideExtensionGrass.wrapT = THREE.RepeatWrapping;

    leftRightInsideExtensionGrass.repeat.set(ConstantHelper.cityGrassWidth, ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth);

    const leftRightInsideExtensionGrassGeometry = new THREE.PlaneGeometry(ConstantHelper.cityGrassWidth, ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth);
    const leftRightInsideExtensionGrassMaterial = new THREE.MeshStandardMaterial({ map: leftRightInsideExtensionGrass, side: THREE.FrontSide });

    const leftRearInsideExtensionGrass = new THREE.Mesh(leftRightInsideExtensionGrassGeometry, leftRightInsideExtensionGrassMaterial);
    leftRearInsideExtensionGrass.rotation.x = -Math.PI / 2;
    leftRearInsideExtensionGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + (ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth) / 2));
    leftRearInsideExtensionGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(leftRearInsideExtensionGrass);

    const leftFrontInsideExtensionGrass = new THREE.Mesh(leftRightInsideExtensionGrassGeometry, leftRightInsideExtensionGrassMaterial);
    leftFrontInsideExtensionGrass.rotation.x = -Math.PI / 2;
    leftFrontInsideExtensionGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + (ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .01, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth) / 2));
    leftFrontInsideExtensionGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(leftFrontInsideExtensionGrass);

    const rightRearInsideExtensionGrass = new THREE.Mesh(leftRightInsideExtensionGrassGeometry, leftRightInsideExtensionGrassMaterial);
    rightRearInsideExtensionGrass.rotation.x = -Math.PI / 2;
    rightRearInsideExtensionGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - (ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth) / 2));
    rightRearInsideExtensionGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(rightRearInsideExtensionGrass);

    const rightFrontInsideExtensionGrass = new THREE.Mesh(leftRightInsideExtensionGrassGeometry, leftRightInsideExtensionGrassMaterial);
    rightFrontInsideExtensionGrass.rotation.x = -Math.PI / 2;
    rightFrontInsideExtensionGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - (ConstantHelper.cityGrassWidth / 2), ConstantHelper.citySidewalkHeight - .01, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth) / 2));
    rightFrontInsideExtensionGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(rightFrontInsideExtensionGrass);

    const frontRearOutsideExtensionCityGrass = this.textureLoader.load(`assets/textures/grounds/city-grass.jpg`);

    frontRearOutsideExtensionCityGrass.wrapS = THREE.RepeatWrapping;
    frontRearOutsideExtensionCityGrass.wrapT = THREE.RepeatWrapping;

    frontRearOutsideExtensionCityGrass.repeat.set(ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth, ConstantHelper.cityGrassWidth);

    const frontRearOutsideExtensionGrassGeometry = new THREE.PlaneGeometry(ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth, ConstantHelper.cityGrassWidth);
    const frontRearOutsideExtensionGrassMaterial = new THREE.MeshStandardMaterial({ map: frontRearOutsideExtensionCityGrass, side: THREE.FrontSide });

    const frontLeftFrontOutsideExtensionGrass = new THREE.Mesh(frontRearOutsideExtensionGrassGeometry, frontRearOutsideExtensionGrassMaterial);
    frontLeftFrontOutsideExtensionGrass.rotation.x = -Math.PI / 2;
    frontLeftFrontOutsideExtensionGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth) / 2), ConstantHelper.citySidewalkHeight - .01, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityGrassWidth / 2));
    frontLeftFrontOutsideExtensionGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(frontLeftFrontOutsideExtensionGrass);

    const frontLeftRearOutsideExtensionGrass = new THREE.Mesh(frontRearOutsideExtensionGrassGeometry, frontRearOutsideExtensionGrassMaterial);
    frontLeftRearOutsideExtensionGrass.rotation.x = -Math.PI / 2;
    frontLeftRearOutsideExtensionGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth) / 2), ConstantHelper.citySidewalkHeight - .01, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - (ConstantHelper.cityGrassWidth / 2));
    frontLeftRearOutsideExtensionGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(frontLeftRearOutsideExtensionGrass);

    const frontRightFrontOutsideExtensionGrass = new THREE.Mesh(frontRearOutsideExtensionGrassGeometry, frontRearOutsideExtensionGrassMaterial);
    frontRightFrontOutsideExtensionGrass.rotation.x = -Math.PI / 2;
    frontRightFrontOutsideExtensionGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth) / 2), ConstantHelper.citySidewalkHeight - .01, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityGrassWidth / 2));
    frontRightFrontOutsideExtensionGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(frontRightFrontOutsideExtensionGrass);

    const frontRightRearOutsideExtensionGrass = new THREE.Mesh(frontRearOutsideExtensionGrassGeometry, frontRearOutsideExtensionGrassMaterial);
    frontRightRearOutsideExtensionGrass.rotation.x = -Math.PI / 2;
    frontRightRearOutsideExtensionGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth) / 2), ConstantHelper.citySidewalkHeight - .01, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - (ConstantHelper.cityGrassWidth / 2));
    frontRightRearOutsideExtensionGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(frontRightRearOutsideExtensionGrass);

    const rearLeftFrontOutsideExtensionGrass = new THREE.Mesh(frontRearOutsideExtensionGrassGeometry, frontRearOutsideExtensionGrassMaterial);
    rearLeftFrontOutsideExtensionGrass.rotation.x = -Math.PI / 2;
    rearLeftFrontOutsideExtensionGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth) / 2), ConstantHelper.citySidewalkHeight - .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityGrassWidth / 2));
    rearLeftFrontOutsideExtensionGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(rearLeftFrontOutsideExtensionGrass);

    const rearLeftRearOutsideExtensionGrass = new THREE.Mesh(frontRearOutsideExtensionGrassGeometry, frontRearOutsideExtensionGrassMaterial);
    rearLeftRearOutsideExtensionGrass.rotation.x = -Math.PI / 2;
    rearLeftRearOutsideExtensionGrass.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth) / 2), ConstantHelper.citySidewalkHeight - .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + (ConstantHelper.cityGrassWidth / 2));
    rearLeftRearOutsideExtensionGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(rearLeftRearOutsideExtensionGrass);

    const rearRightFrontOutsideExtensionGrass = new THREE.Mesh(frontRearOutsideExtensionGrassGeometry, frontRearOutsideExtensionGrassMaterial);
    rearRightFrontOutsideExtensionGrass.rotation.x = -Math.PI / 2;
    rearRightFrontOutsideExtensionGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth) / 2), ConstantHelper.citySidewalkHeight - .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityGrassWidth / 2));
    rearRightFrontOutsideExtensionGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(rearRightFrontOutsideExtensionGrass);

    const rearRightRearOutsideExtensionGrass = new THREE.Mesh(frontRearOutsideExtensionGrassGeometry, frontRearOutsideExtensionGrassMaterial);
    rearRightRearOutsideExtensionGrass.rotation.x = -Math.PI / 2;
    rearRightRearOutsideExtensionGrass.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth) / 2), ConstantHelper.citySidewalkHeight - .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + (ConstantHelper.cityGrassWidth / 2));
    rearRightRearOutsideExtensionGrass.userData['type'] = 'city-plane-grass';
    grassGroup.add(rearRightRearOutsideExtensionGrass);

    return grassGroup;
  }

  private createStreetForCity(): THREE.Group {
    const streetGroup = new THREE.Group();
    streetGroup.userData['type'] = 'street-group';

    const streetHorizontalLength: number = this.width! + (2 * ConstantHelper.citySidewalkWidth) + (2 * ConstantHelper.cityGrassWidth) + (2 * ConstantHelper.cityKerbWidth);

    // street texture link: https://ambientcg.com/view?id=Road007
    const frontRearStreetTexture = this.textureLoader.load(`assets/textures/street/street.jpg`);

    frontRearStreetTexture.wrapS = THREE.RepeatWrapping;
    frontRearStreetTexture.wrapT = THREE.RepeatWrapping;
    frontRearStreetTexture.rotation = Math.PI / 2;

    frontRearStreetTexture.repeat.set(1, ((streetHorizontalLength / 2) - (ConstantHelper.cityStreetWidth / 2)) / ConstantHelper.cityStreetWidth);

    const frontRearStreetGeometry = new THREE.PlaneGeometry((streetHorizontalLength / 2) - (ConstantHelper.cityStreetWidth / 2), ConstantHelper.cityStreetWidth);
    const frontRearStreetMaterial = new THREE.MeshStandardMaterial({ map: frontRearStreetTexture, side: THREE.FrontSide });

    const frontLeftStreet = new THREE.Mesh(frontRearStreetGeometry, frontRearStreetMaterial);
    frontLeftStreet.rotation.x = -Math.PI / 2;
    frontLeftStreet.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth - (((streetHorizontalLength / 2) - (ConstantHelper.cityStreetWidth / 2)) / 2), .01, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityStreetWidth / 2));
    frontLeftStreet.userData['type'] = 'street';
    streetGroup.add(frontLeftStreet);

    const frontRightStreet = new THREE.Mesh(frontRearStreetGeometry, frontRearStreetMaterial);
    frontRightStreet.rotation.x = -Math.PI / 2;
    frontRightStreet.position.set(-(((streetHorizontalLength / 2) - (ConstantHelper.cityStreetWidth / 2)) / 2) - (ConstantHelper.cityStreetWidth / 2), .01, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityStreetWidth / 2));
    frontRightStreet.userData['type'] = 'street';
    streetGroup.add(frontRightStreet);

    const frontPedestrianCossingTexture = this.textureLoader.load(`assets/textures/street/pedestrian-crossing.jpg`);

    frontPedestrianCossingTexture.wrapS = THREE.RepeatWrapping;
    frontPedestrianCossingTexture.wrapT = THREE.RepeatWrapping;
    frontPedestrianCossingTexture.rotation = Math.PI / 2;

    frontPedestrianCossingTexture.repeat.set(1, 1);

    const frontPedestrianCossingGeometry = new THREE.PlaneGeometry(ConstantHelper.cityStreetWidth, ConstantHelper.cityStreetWidth);
    const frontPedestrianCossingMaterial = new THREE.MeshStandardMaterial({ map: frontPedestrianCossingTexture, side: THREE.FrontSide });

    const frontPedestrianCossing = new THREE.Mesh(frontPedestrianCossingGeometry, frontPedestrianCossingMaterial);
    frontPedestrianCossing.rotation.x = -Math.PI / 2;
    frontPedestrianCossing.position.set(0, .01, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityStreetWidth / 2));
    frontPedestrianCossing.userData['type'] = 'pedestrian-crossing';
    streetGroup.add(frontPedestrianCossing);

    const rearLeftStreet = new THREE.Mesh(frontRearStreetGeometry, frontRearStreetMaterial);
    rearLeftStreet.rotation.x = -Math.PI / 2;
    rearLeftStreet.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth - (((streetHorizontalLength / 2) - (ConstantHelper.cityStreetWidth / 2)) / 2), .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityStreetWidth / 2));
    rearLeftStreet.userData['type'] = 'street';
    streetGroup.add(rearLeftStreet);

    const rearRightStreet = new THREE.Mesh(frontRearStreetGeometry, frontRearStreetMaterial);
    rearRightStreet.rotation.x = -Math.PI / 2;
    rearRightStreet.position.set(-(((streetHorizontalLength / 2) - (ConstantHelper.cityStreetWidth / 2)) / 2) - (ConstantHelper.cityStreetWidth / 2), .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityStreetWidth / 2));
    rearRightStreet.userData['type'] = 'street';
    streetGroup.add(rearRightStreet);

    const rearPedestrianCossing = new THREE.Mesh(frontPedestrianCossingGeometry, frontPedestrianCossingMaterial);
    rearPedestrianCossing.rotation.x = -Math.PI / 2;
    rearPedestrianCossing.position.set(0, .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityStreetWidth / 2));
    rearPedestrianCossing.userData['type'] = 'pedestrian-crossing';
    streetGroup.add(rearPedestrianCossing);

    const streetVerticalLength: number = this.depth! + (2 * ConstantHelper.citySidewalkWidth) + (2 * ConstantHelper.cityGrassWidth) + (2 * ConstantHelper.cityKerbWidth);
    const leftRightStreetTexture = this.textureLoader.load(`assets/textures/street/street.jpg`);

    leftRightStreetTexture.wrapS = THREE.RepeatWrapping;
    leftRightStreetTexture.wrapT = THREE.RepeatWrapping;

    leftRightStreetTexture.repeat.set(1, streetVerticalLength / ConstantHelper.cityStreetWidth);

    const leftRightStreetGeometry = new THREE.PlaneGeometry(ConstantHelper.cityStreetWidth, streetVerticalLength);
    const leftRightStreetMaterial = new THREE.MeshStandardMaterial({ map: leftRightStreetTexture, side: THREE.FrontSide });

    const leftStreet = new THREE.Mesh(leftRightStreetGeometry, leftRightStreetMaterial);
    leftStreet.rotation.x = -Math.PI / 2;
    leftStreet.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityStreetWidth / 2), .01, 0);
    leftStreet.userData['type'] = 'street';
    streetGroup.add(leftStreet);

    const rightStreet = new THREE.Mesh(leftRightStreetGeometry, leftRightStreetMaterial);
    rightStreet.rotation.x = -Math.PI / 2;
    rightStreet.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityStreetWidth / 2), .01, 0);
    rightStreet.userData['type'] = 'street';
    streetGroup.add(rightStreet);

    const streetCornerTexture = this.textureLoader.load(`assets/textures/street/street-corner.jpg`);

    streetCornerTexture.wrapS = THREE.RepeatWrapping;
    streetCornerTexture.wrapT = THREE.RepeatWrapping;

    streetCornerTexture.repeat.set(1, 1);

    const streetCornerGeometry = new THREE.PlaneGeometry(ConstantHelper.cityStreetWidth, ConstantHelper.cityStreetWidth);
    const streetCornerMaterial = new THREE.MeshStandardMaterial({ map: streetCornerTexture, side: THREE.FrontSide });

    const leftRearStreetCorner = new THREE.Mesh(streetCornerGeometry, streetCornerMaterial);
    leftRearStreetCorner.rotation.x = -Math.PI / 2;
    leftRearStreetCorner.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityStreetWidth / 2), .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityStreetWidth / 2));
    leftRearStreetCorner.userData['type'] = 'street';
    streetGroup.add(leftRearStreetCorner);

    const leftFrontStreetCorner = new THREE.Mesh(streetCornerGeometry, streetCornerMaterial);
    leftFrontStreetCorner.rotation.x = -Math.PI / 2;
    leftFrontStreetCorner.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityStreetWidth / 2), .01, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityStreetWidth / 2));
    leftFrontStreetCorner.userData['type'] = 'street';
    streetGroup.add(leftFrontStreetCorner);

    const rightRearStreetCorner = new THREE.Mesh(streetCornerGeometry, streetCornerMaterial);
    rightRearStreetCorner.rotation.x = -Math.PI / 2;
    rightRearStreetCorner.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityStreetWidth / 2), .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityStreetWidth / 2));
    rightRearStreetCorner.userData['type'] = 'street';
    streetGroup.add(rightRearStreetCorner);

    const rightFrontStreetCorner = new THREE.Mesh(streetCornerGeometry, streetCornerMaterial);
    rightFrontStreetCorner.rotation.x = -Math.PI / 2;
    rightFrontStreetCorner.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityStreetWidth / 2), .01, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityStreetWidth / 2));
    rightFrontStreetCorner.userData['type'] = 'street';
    streetGroup.add(rightFrontStreetCorner);

    const frontRearStreetExtensionTexture = this.textureLoader.load(`assets/textures/street/street.jpg`);

    frontRearStreetExtensionTexture.wrapS = THREE.RepeatWrapping;
    frontRearStreetExtensionTexture.wrapT = THREE.RepeatWrapping;

    frontRearStreetExtensionTexture.repeat.set(1, 1);

    const frontRearStreetExtensionGeometry = new THREE.PlaneGeometry(ConstantHelper.cityStreetWidth, ConstantHelper.cityStreetWidth);
    const frontRearStreetExtensionMaterial = new THREE.MeshStandardMaterial({ map: frontRearStreetExtensionTexture, side: THREE.FrontSide });

    const frontLeftStreetExtension = new THREE.Mesh(frontRearStreetExtensionGeometry, frontRearStreetExtensionMaterial);
    frontLeftStreetExtension.rotation.x = -Math.PI / 2;
    frontLeftStreetExtension.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth - (ConstantHelper.cityStreetWidth / 2), .01, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - (ConstantHelper.cityStreetWidth / 2));
    frontLeftStreetExtension.userData['type'] = 'street';
    streetGroup.add(frontLeftStreetExtension);

    const frontRightStreetExtension = new THREE.Mesh(frontRearStreetExtensionGeometry, frontRearStreetExtensionMaterial);
    frontRightStreetExtension.rotation.x = -Math.PI / 2;
    frontRightStreetExtension.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth + (ConstantHelper.cityStreetWidth / 2), .01, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - (ConstantHelper.cityStreetWidth / 2));
    frontRightStreetExtension.userData['type'] = 'street';
    streetGroup.add(frontRightStreetExtension);

    const rearLeftStreetExtension = new THREE.Mesh(frontRearStreetExtensionGeometry, frontRearStreetExtensionMaterial);
    rearLeftStreetExtension.rotation.x = -Math.PI / 2;
    rearLeftStreetExtension.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth - (ConstantHelper.cityStreetWidth / 2), .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityStreetWidth / 2));
    rearLeftStreetExtension.userData['type'] = 'street';
    streetGroup.add(rearLeftStreetExtension);

    const rearRightStreetExtension = new THREE.Mesh(frontRearStreetExtensionGeometry, frontRearStreetExtensionMaterial);
    rearRightStreetExtension.rotation.x = -Math.PI / 2;
    rearRightStreetExtension.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth + (ConstantHelper.cityStreetWidth / 2), .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + (ConstantHelper.cityStreetWidth / 2));
    rearRightStreetExtension.userData['type'] = 'street';
    streetGroup.add(rearRightStreetExtension);

    const leftRightStreetExtensionTexture = this.textureLoader.load(`assets/textures/street/street.jpg`);

    leftRightStreetExtensionTexture.wrapS = THREE.RepeatWrapping;
    leftRightStreetExtensionTexture.wrapT = THREE.RepeatWrapping;
    leftRightStreetExtensionTexture.rotation = Math.PI / 2;

    leftRightStreetExtensionTexture.repeat.set(1, 1);

    const leftRightStreetExtensionGeometry = new THREE.PlaneGeometry(ConstantHelper.cityStreetWidth, ConstantHelper.cityStreetWidth);
    const leftRightStreetExtensionMaterial = new THREE.MeshStandardMaterial({ map: leftRightStreetExtensionTexture, side: THREE.FrontSide });

    const leftFrontStreetExtension = new THREE.Mesh(leftRightStreetExtensionGeometry, leftRightStreetExtensionMaterial);
    leftFrontStreetExtension.rotation.x = -Math.PI / 2;
    leftFrontStreetExtension.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityStreetWidth * 2) - (ConstantHelper.cityStreetWidth / 2), .01, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityStreetWidth / 2));
    leftFrontStreetExtension.userData['type'] = 'street';
    streetGroup.add(leftFrontStreetExtension);

    const leftRearStreetExtension = new THREE.Mesh(leftRightStreetExtensionGeometry, leftRightStreetExtensionMaterial);
    leftRearStreetExtension.rotation.x = -Math.PI / 2;
    leftRearStreetExtension.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityStreetWidth * 2) - (ConstantHelper.cityStreetWidth / 2), .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityStreetWidth / 2));
    leftRearStreetExtension.userData['type'] = 'street';
    streetGroup.add(leftRearStreetExtension);

    const rightFrontStreetExtension = new THREE.Mesh(leftRightStreetExtensionGeometry, leftRightStreetExtensionMaterial);
    rightFrontStreetExtension.rotation.x = -Math.PI / 2;
    rightFrontStreetExtension.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityStreetWidth * 2) + (ConstantHelper.cityStreetWidth / 2), .01, (-this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityStreetWidth / 2));
    rightFrontStreetExtension.userData['type'] = 'street';
    streetGroup.add(rightFrontStreetExtension);

    const rightRearStreetExtension = new THREE.Mesh(leftRightStreetExtensionGeometry, leftRightStreetExtensionMaterial);
    rightRearStreetExtension.rotation.x = -Math.PI / 2;
    rightRearStreetExtension.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - (ConstantHelper.cityStreetWidth * 2) + (ConstantHelper.cityStreetWidth / 2), .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + (ConstantHelper.cityStreetWidth / 2));
    rightRearStreetExtension.userData['type'] = 'street';
    streetGroup.add(rightRearStreetExtension);

    return streetGroup;
  }

  private createBuildingsForCity(): THREE.Group {
    const buildingsGroup = new THREE.Group();
    buildingsGroup.userData['type'] = 'buildings-group';

    const buildingFloorsGroup = this.createBuildingFloors();
    buildingsGroup.add(buildingFloorsGroup);

    const buildingsCornersGroup = this.createCornersOfBuildings();
    buildingsGroup.add(buildingsCornersGroup);

    const middleOfBuildingsGroup = this.createMiddleOfBuildingsGroup();
    buildingsGroup.add(middleOfBuildingsGroup);

    return buildingsGroup;
  }

  private createMiddleOfBuildingsGroup(): THREE.Group {
    const middleBuildingsGroup = new THREE.Group();
    middleBuildingsGroup.userData['type'] = 'middle-buildings-group';

    const rearMiddleOfBuilding = this.createMiddleOfBuilding(this.width! - (2 * ConstantHelper.citySidewalkWidth));
    const frontMiddleOfBuilding = rearMiddleOfBuilding.clone();

    rearMiddleOfBuilding.position.set(0, ConstantHelper.citySidewalkHeight, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth);
    middleBuildingsGroup.add(rearMiddleOfBuilding);

    frontMiddleOfBuilding.position.set(0, ConstantHelper.citySidewalkHeight, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth);
    frontMiddleOfBuilding.rotateY(Math.PI);
    middleBuildingsGroup.add(frontMiddleOfBuilding);

    const leftMiddleOfBuilding = this.createMiddleOfBuilding(this.depth! - (2 * ConstantHelper.citySidewalkWidth));
    const rightMiddleOfBuilding = leftMiddleOfBuilding.clone();

    leftMiddleOfBuilding.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth, ConstantHelper.citySidewalkHeight, 0);
    leftMiddleOfBuilding.rotateY(Math.PI / 2);
    middleBuildingsGroup.add(leftMiddleOfBuilding);

    rightMiddleOfBuilding.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth, ConstantHelper.citySidewalkHeight, 0);
    rightMiddleOfBuilding.rotateY(-Math.PI / 2);
    middleBuildingsGroup.add(rightMiddleOfBuilding);

    return middleBuildingsGroup;
  }

  private createBuildingsFillings(offset: number): THREE.Group {
    const fillingsGroup = new THREE.Group();
    fillingsGroup.userData['type'] = 'building-fillings';

    const leftFilling = this.createBuildingFillingHole('left');
    leftFilling.position.set((offset / 2), ConstantHelper.cityBuildingBottomHeight, -ConstantHelper.cityBuildingTopPartOffset)
    leftFilling.rotateY(-Math.PI / 8)
    fillingsGroup.add(leftFilling);

    const rightFilling = this.createBuildingFillingHole('right');
    rightFilling.position.set(-(offset / 2), ConstantHelper.cityBuildingBottomHeight, -ConstantHelper.cityBuildingTopPartOffset)
    rightFilling.rotateY(Math.PI / 8)
    fillingsGroup.add(rightFilling);

    return fillingsGroup;
  }

  private createBuildingFillingHole(side: 'left' | 'right'): THREE.Group {
    const fillingHole = new THREE.Group();
    fillingHole.userData['type'] = 'filling-hole';

    const a = ConstantHelper.cityBuildingTopPartOffset;
    const angle = Math.PI / 4;

    const shape = new THREE.Shape();

    shape.moveTo(0, 0);
    shape.lineTo(a, 0);
    shape.lineTo(a - a * Math.cos(angle), a * Math.sin(angle));
    shape.lineTo(0, 0);

    const c = Math.sqrt(2 * a * a * (1 - Math.cos(angle)));

    const geometry = new THREE.ShapeGeometry(shape);

    const fillingTriangleTexture = this.textureLoader.load(`assets/textures/building-wall/building-wall.jpg`);

    fillingTriangleTexture.wrapS = THREE.RepeatWrapping;
    fillingTriangleTexture.wrapT = THREE.RepeatWrapping;

    fillingTriangleTexture.repeat.set(ConstantHelper.cityBuildingTopPartOffset, ConstantHelper.cityBuildingTopPartOffset);

    const material = new THREE.MeshStandardMaterial({
      side: THREE.FrontSide,
      map: fillingTriangleTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: .1
    });

    const horizontalTriangle = new THREE.Mesh(geometry, material);
    horizontalTriangle.rotateY(Math.PI);
    horizontalTriangle.rotateX(Math.PI / 2);
    horizontalTriangle.rotateZ(Math.PI / 2 + Math.PI / 8);
    horizontalTriangle.rotateZ(-Math.PI);
    horizontalTriangle.position.set((side === 'left' ? c : 0), 0, 0);

    fillingHole.add(horizontalTriangle);

    const fillingWallTexture = this.textureLoader.load(`assets/textures/building-wall/building-wall.jpg`);

    fillingWallTexture.wrapS = THREE.RepeatWrapping;
    fillingWallTexture.wrapT = THREE.RepeatWrapping;

    fillingWallTexture.repeat.set(c, ConstantHelper.cityBuildingTopHeight);

    const topPartOfBuildingGeometry = new THREE.PlaneGeometry(c, ConstantHelper.cityBuildingTopHeight);
    const topPartOfBuildingMaterial = new THREE.MeshStandardMaterial(
      {
        map: fillingWallTexture,
        side: THREE.FrontSide,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.5
      }
    );

    const h = (a * Math.sqrt(2 + Math.sqrt(2))) / 2;

    const fillingWall = new THREE.Mesh(topPartOfBuildingGeometry, topPartOfBuildingMaterial);
    fillingWall.rotation.y = Math.PI;
    fillingWall.position.set((side === 'left' ? c : -c) / 2, ConstantHelper.cityBuildingTopHeight / 2, 0);
    fillingWall.userData['type'] = 'building';

    fillingHole.add(fillingWall);

    return fillingHole;
  }

  private createMiddleOfBuilding(width: number): THREE.Group {
    const buildingGroup = new THREE.Group();
    buildingGroup.userData['type'] = 'middle-building';

    const bottomPartOfBuildingTexture = this.textureLoader.load(`assets/textures/building-wall/building-wall.jpg`);

    bottomPartOfBuildingTexture.wrapS = THREE.RepeatWrapping;
    bottomPartOfBuildingTexture.wrapT = THREE.RepeatWrapping;

    bottomPartOfBuildingTexture.repeat.set(width, ConstantHelper.cityBuildingBottomHeight);

    const bottomPartOfBuildingGeometry = new THREE.PlaneGeometry(width, ConstantHelper.cityBuildingBottomHeight);
    const bottomPartOfBuildingMaterial = new THREE.MeshStandardMaterial(
      {
        map: bottomPartOfBuildingTexture,
        side: THREE.FrontSide,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0.3
      }
    );

    const bottomWall = new THREE.Mesh(bottomPartOfBuildingGeometry, bottomPartOfBuildingMaterial);
    bottomWall.rotation.y = Math.PI;
    bottomWall.position.set(0, (ConstantHelper.cityBuildingBottomHeight / 2), 0);
    bottomWall.userData['type'] = 'building';

    buildingGroup.add(bottomWall);

    const buildingBrakeTexture = this.textureLoader.load(`assets/textures/building-wall/building-wall.jpg`);

    buildingBrakeTexture.wrapS = THREE.RepeatWrapping;
    buildingBrakeTexture.wrapT = THREE.RepeatWrapping;

    buildingBrakeTexture.repeat.set(width, ConstantHelper.cityBuildingTopPartOffset);

    const buildingBrakeGeometry = new THREE.PlaneGeometry(width, ConstantHelper.cityBuildingTopPartOffset);
    const buildingBrakeMaterial = new THREE.MeshStandardMaterial(
      {
        map: buildingBrakeTexture,
        side: THREE.FrontSide,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.1
      }
    );

    const buildingBrake = new THREE.Mesh(buildingBrakeGeometry, buildingBrakeMaterial);
    buildingBrake.rotation.x = Math.PI / 2;
    buildingBrake.position.set(0, ConstantHelper.cityBuildingBottomHeight, -(ConstantHelper.cityBuildingTopPartOffset / 2));
    buildingBrake.userData['type'] = 'building';

    buildingGroup.add(buildingBrake);

    const topPartOfBuildingTexture = this.textureLoader.load(`assets/textures/building-wall/building-wall.jpg`);

    topPartOfBuildingTexture.wrapS = THREE.RepeatWrapping;
    topPartOfBuildingTexture.wrapT = THREE.RepeatWrapping;

    topPartOfBuildingTexture.repeat.set(width, ConstantHelper.cityBuildingTopHeight);

    const topPartOfBuildingGeometry = new THREE.PlaneGeometry(width, ConstantHelper.cityBuildingTopHeight);
    const topPartOfBuildingMaterial = new THREE.MeshStandardMaterial(
      {
        map: bottomPartOfBuildingTexture,
        side: THREE.FrontSide,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.5
      }
    );

    const topWall = new THREE.Mesh(topPartOfBuildingGeometry, topPartOfBuildingMaterial);
    topWall.rotation.y = Math.PI;
    topWall.position.set(0, ConstantHelper.cityBuildingBottomHeight + (ConstantHelper.cityBuildingTopHeight / 2), -ConstantHelper.cityBuildingTopPartOffset);
    topWall.userData['type'] = 'building';

    buildingGroup.add(topWall);

    const doors: THREE.Group = this.createDoor();
    doors.position.set(0, 0, -.001);
    buildingGroup.add(doors);

    const windowColumsNumber: number = Math.floor(width / 3);
    const columnsOffset: number = width / windowColumsNumber;
    let columnPositionX: number = (width / 2) - columnsOffset;

    for (let i = 0; i < windowColumsNumber - 1; i++) {
      const windowsColumn: THREE.Group = this.createWindowsColumn();
      windowsColumn.position.set(columnPositionX, 0, -.001);
      buildingGroup.add(windowsColumn);

      columnPositionX -= columnsOffset;
    }

    const buildingFilling = this.createBuildingsFillings(width);
    buildingGroup.add(buildingFilling);

    return buildingGroup;
  }

  private createCornersOfBuildings(): THREE.Group {
    const cornersOfBuildingsGroup = new THREE.Group();
    cornersOfBuildingsGroup.userData['type'] = 'bottom-of-buildings-group';

    const singleBuildingCornerGroup = new THREE.Group();
    singleBuildingCornerGroup.userData['type'] = 'single-building-corner-group';

    // builing texture link: https://ambientcg.com/view?id=Plaster001
    const bottomPartOfBuildingTexture = this.textureLoader.load(`assets/textures/building-wall/building-wall.jpg`);

    bottomPartOfBuildingTexture.wrapS = THREE.RepeatWrapping;
    bottomPartOfBuildingTexture.wrapT = THREE.RepeatWrapping;

    bottomPartOfBuildingTexture.repeat.set(ConstantHelper.cityBuildingAngledWallWidth, ConstantHelper.cityBuildingBottomHeight);

    const bottomPartOfBuildingGeometry = new THREE.PlaneGeometry(ConstantHelper.cityBuildingAngledWallWidth, ConstantHelper.cityBuildingBottomHeight);
    const bottomPartOfBuildingMaterial = new THREE.MeshStandardMaterial(
      {
        map: bottomPartOfBuildingTexture,
        side: THREE.FrontSide,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0.3
      }
    );

    const bottomWall = new THREE.Mesh(bottomPartOfBuildingGeometry, bottomPartOfBuildingMaterial);
    bottomWall.rotation.y = Math.PI;
    bottomWall.position.set(0, (ConstantHelper.cityBuildingBottomHeight / 2), 0);
    bottomWall.userData['type'] = 'building';

    singleBuildingCornerGroup.add(bottomWall);

    const buildingBrakeTexture = this.textureLoader.load(`assets/textures/building-wall/building-wall.jpg`);

    buildingBrakeTexture.wrapS = THREE.RepeatWrapping;
    buildingBrakeTexture.wrapT = THREE.RepeatWrapping;

    buildingBrakeTexture.repeat.set(ConstantHelper.cityBuildingAngledWallWidth, ConstantHelper.cityBuildingTopPartOffset);

    const buildingBrakeGeometry = new THREE.PlaneGeometry(ConstantHelper.cityBuildingAngledWallWidth, ConstantHelper.cityBuildingTopPartOffset);
    const buildingBrakeMaterial = new THREE.MeshStandardMaterial(
      {
        map: buildingBrakeTexture,
        side: THREE.FrontSide,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.1
      }
    );

    const buildingBrake = new THREE.Mesh(buildingBrakeGeometry, buildingBrakeMaterial);
    buildingBrake.rotation.x = Math.PI / 2;
    buildingBrake.position.set(0, ConstantHelper.cityBuildingBottomHeight, -(ConstantHelper.cityBuildingTopPartOffset / 2));
    buildingBrake.userData['type'] = 'building';

    singleBuildingCornerGroup.add(buildingBrake);

    const topPartOfBuildingTexture = this.textureLoader.load(`assets/textures/building-wall/building-wall.jpg`);

    topPartOfBuildingTexture.wrapS = THREE.RepeatWrapping;
    topPartOfBuildingTexture.wrapT = THREE.RepeatWrapping;

    topPartOfBuildingTexture.repeat.set(ConstantHelper.cityBuildingAngledWallWidth, ConstantHelper.cityBuildingTopHeight);

    const topPartOfBuildingGeometry = new THREE.PlaneGeometry(ConstantHelper.cityBuildingAngledWallWidth, ConstantHelper.cityBuildingTopHeight);
    const topPartOfBuildingMaterial = new THREE.MeshStandardMaterial(
      {
        map: bottomPartOfBuildingTexture,
        side: THREE.FrontSide,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.5
      }
    );

    const topWall = new THREE.Mesh(topPartOfBuildingGeometry, topPartOfBuildingMaterial);
    topWall.rotation.y = Math.PI;
    topWall.position.set(0, ConstantHelper.cityBuildingBottomHeight + (ConstantHelper.cityBuildingTopHeight / 2), -ConstantHelper.cityBuildingTopPartOffset);
    topWall.userData['type'] = 'building';

    singleBuildingCornerGroup.add(topWall);

    const doors: THREE.Group = this.createDoor();
    doors.position.set(0, 0, -.001);
    singleBuildingCornerGroup.add(doors);

    const windows: THREE.Group = this.createWindowsColumn();
    windows.position.set(0, 0, -.001);
    singleBuildingCornerGroup.add(windows);

    singleBuildingCornerGroup.position.set(0, 0, 0);

    const rearRightExtensionBuildingAngled = singleBuildingCornerGroup.clone();
    rearRightExtensionBuildingAngled.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2));
    rearRightExtensionBuildingAngled.rotateY(-Math.PI / 4);
    cornersOfBuildingsGroup.add(rearRightExtensionBuildingAngled);

    const rearLeftExtensionBuildingAngled = singleBuildingCornerGroup.clone();
    rearLeftExtensionBuildingAngled.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2));
    rearLeftExtensionBuildingAngled.rotateY(Math.PI / 4);
    cornersOfBuildingsGroup.add(rearLeftExtensionBuildingAngled);

    const frontRightExtensionBuildingAngled = singleBuildingCornerGroup.clone();
    frontRightExtensionBuildingAngled.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2));
    frontRightExtensionBuildingAngled.rotateY(Math.PI);
    frontRightExtensionBuildingAngled.rotateY(Math.PI / 4);
    cornersOfBuildingsGroup.add(frontRightExtensionBuildingAngled);

    const frontLeftExtensionBuildingAngled = singleBuildingCornerGroup.clone();
    frontLeftExtensionBuildingAngled.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2));
    frontLeftExtensionBuildingAngled.rotateY(Math.PI);
    frontLeftExtensionBuildingAngled.rotateY(-Math.PI / 4);
    cornersOfBuildingsGroup.add(frontLeftExtensionBuildingAngled);

    const rearRightMiddleBuildingAngled = singleBuildingCornerGroup.clone();
    rearRightMiddleBuildingAngled.position.set(-(this.width! / 2) + (ConstantHelper.citySidewalkWidth / 2), ConstantHelper.citySidewalkHeight, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2));
    rearRightMiddleBuildingAngled.rotateY(Math.PI / 4);
    cornersOfBuildingsGroup.add(rearRightMiddleBuildingAngled);

    const rearLeftMiddleBuildingAngled = singleBuildingCornerGroup.clone();
    rearLeftMiddleBuildingAngled.position.set((this.width! / 2) - (ConstantHelper.citySidewalkWidth / 2), ConstantHelper.citySidewalkHeight, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2));
    rearLeftMiddleBuildingAngled.rotateY(-Math.PI / 4);
    cornersOfBuildingsGroup.add(rearLeftMiddleBuildingAngled);

    const frontRightMiddleBuildingAngled = singleBuildingCornerGroup.clone();
    frontRightMiddleBuildingAngled.position.set(-(this.width! / 2) + (ConstantHelper.citySidewalkWidth / 2), ConstantHelper.citySidewalkHeight, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2));
    frontRightMiddleBuildingAngled.rotateY(Math.PI);
    frontRightMiddleBuildingAngled.rotateY(-Math.PI / 4);
    cornersOfBuildingsGroup.add(frontRightMiddleBuildingAngled);

    const frontLeftMiddleBuildingAngled = singleBuildingCornerGroup.clone();
    frontLeftMiddleBuildingAngled.position.set((this.width! / 2) - (ConstantHelper.citySidewalkWidth / 2), ConstantHelper.citySidewalkHeight, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2));
    frontLeftMiddleBuildingAngled.rotateY(Math.PI);
    frontLeftMiddleBuildingAngled.rotateY(Math.PI / 4);
    cornersOfBuildingsGroup.add(frontLeftMiddleBuildingAngled);

    const leftFrontMiddleBuildingAngled = singleBuildingCornerGroup.clone();
    leftFrontMiddleBuildingAngled.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight, -(this.depth! / 2) + (ConstantHelper.citySidewalkWidth / 2));
    leftFrontMiddleBuildingAngled.rotateY(Math.PI / 4);
    cornersOfBuildingsGroup.add(leftFrontMiddleBuildingAngled);

    const leftRearMiddleBuildingAngled = singleBuildingCornerGroup.clone();
    leftRearMiddleBuildingAngled.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight, (this.depth! / 2) - (ConstantHelper.citySidewalkWidth / 2));
    leftRearMiddleBuildingAngled.rotateY(Math.PI);
    leftRearMiddleBuildingAngled.rotateY(-Math.PI / 4);
    cornersOfBuildingsGroup.add(leftRearMiddleBuildingAngled);

    const rightFrontMiddleBuildingAngled = singleBuildingCornerGroup.clone();
    rightFrontMiddleBuildingAngled.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight, -(this.depth! / 2) + (ConstantHelper.citySidewalkWidth / 2));
    rightFrontMiddleBuildingAngled.rotateY(-Math.PI / 4);
    cornersOfBuildingsGroup.add(rightFrontMiddleBuildingAngled);

    const rightRearMiddleBuildingAngled = singleBuildingCornerGroup.clone();
    rightRearMiddleBuildingAngled.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight, (this.depth! / 2) - (ConstantHelper.citySidewalkWidth / 2));
    rightRearMiddleBuildingAngled.rotateY(Math.PI);
    rightRearMiddleBuildingAngled.rotateY(Math.PI / 4);
    cornersOfBuildingsGroup.add(rightRearMiddleBuildingAngled);

    return cornersOfBuildingsGroup;
  }

  private createDoor(): THREE.Group {
    const doorGroup = new THREE.Group();
    doorGroup.userData['type'] = 'doors-group';

    // doors texture link: https://ambientcg.com/view?id=Plastic013A
    const bottomTopPartTexture = this.textureLoader.load(`assets/textures/plastic/plastic.jpg`);

    bottomTopPartTexture.wrapS = THREE.RepeatWrapping;
    bottomTopPartTexture.wrapT = THREE.RepeatWrapping;

    bottomTopPartTexture.repeat.set(ConstantHelper.cityDoorWidth, .2);

    const bottomTopPartGeometry = new THREE.PlaneGeometry(ConstantHelper.cityDoorWidth, .2);
    const bottomTopPartMaterial = new THREE.MeshStandardMaterial(
      {
        map: bottomTopPartTexture,
        side: THREE.FrontSide,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 1
      }
    );

    const bottomPart = new THREE.Mesh(bottomTopPartGeometry, bottomTopPartMaterial);
    bottomPart.rotation.y = Math.PI;
    bottomPart.position.set(0, (.2 / 2), 0);
    bottomPart.userData['type'] = 'door-part';
    doorGroup.add(bottomPart);

    const topPart = new THREE.Mesh(bottomTopPartGeometry, bottomTopPartMaterial);
    topPart.rotation.y = Math.PI;
    topPart.position.set(0, ConstantHelper.cityDoorHeight - (.2 / 2), 0);
    topPart.userData['type'] = 'door-part';
    doorGroup.add(topPart);

    const leftRightPartTexture = this.textureLoader.load(`assets/textures/plastic/plastic.jpg`);

    leftRightPartTexture.wrapS = THREE.RepeatWrapping;
    leftRightPartTexture.wrapT = THREE.RepeatWrapping;

    leftRightPartTexture.repeat.set(.2, ConstantHelper.cityDoorHeight - (2 * .2));

    const leftRightPartGeometry = new THREE.PlaneGeometry(.2, ConstantHelper.cityDoorHeight - (2 * .2));
    const leftRightPartMaterial = new THREE.MeshStandardMaterial(
      {
        map: leftRightPartTexture,
        side: THREE.FrontSide,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 1
      }
    );

    const leftPart = new THREE.Mesh(leftRightPartGeometry, leftRightPartMaterial);
    leftPart.rotation.y = Math.PI;
    leftPart.position.set((ConstantHelper.cityDoorWidth / 2) - (.2 / 2), ConstantHelper.cityDoorHeight / 2, 0);
    leftPart.userData['type'] = 'door-part';
    doorGroup.add(leftPart);

    const rightPart = new THREE.Mesh(leftRightPartGeometry, leftRightPartMaterial);
    rightPart.rotation.y = Math.PI;
    rightPart.position.set(-(ConstantHelper.cityDoorWidth / 2) + (.2 / 2), ConstantHelper.cityDoorHeight / 2, 0);
    rightPart.userData['type'] = 'door-part';
    doorGroup.add(rightPart);

    const mirrorGeometry = new THREE.PlaneGeometry(ConstantHelper.cityDoorWidth - (2 * .2), ConstantHelper.cityDoorHeight - (2 * .2));

    const mirrorMaterial = new THREE.MeshStandardMaterial({
      side: THREE.FrontSide,
      color: 0xababab,
      metalness: .7,
      roughness: .1,
      envMap: this.mirrorCamera!.renderTarget.texture,
      envMapIntensity: 1
    });

    const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    mirror.rotateY(Math.PI);
    mirror.position.set(0, ConstantHelper.cityDoorHeight / 2, 0);

    doorGroup.add(mirror);

    const hangleTopBottomTexture = this.textureLoader.load(`assets/textures/plastic/plastic.jpg`);

    hangleTopBottomTexture.wrapS = THREE.RepeatWrapping;
    hangleTopBottomTexture.wrapT = THREE.RepeatWrapping;

    hangleTopBottomTexture.repeat.set(.05, .02);

    const hangleTopBottomGeometry = new THREE.PlaneGeometry(.05, .02);

    const hangleTopBottomMaterial = new THREE.MeshStandardMaterial({
      map: hangleTopBottomTexture,
      side: THREE.FrontSide,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: .1
    });

    const hangleBottom = new THREE.Mesh(hangleTopBottomGeometry, hangleTopBottomMaterial);
    hangleBottom.position.set((ConstantHelper.cityDoorWidth / 2) - (.2 / 2), (ConstantHelper.cityDoorHeight / 2) - .2, -(.05 / 2));
    hangleBottom.rotateZ(-Math.PI / 2);
    hangleBottom.rotateY(Math.PI / 2);
    doorGroup.add(hangleBottom);

    const hangleTop = new THREE.Mesh(hangleTopBottomGeometry, hangleTopBottomMaterial);
    hangleTop.position.set((ConstantHelper.cityDoorWidth / 2) - (.2 / 2), (ConstantHelper.cityDoorHeight / 2) - (.2 - .02), -(.05 / 2));
    hangleTop.rotateZ(Math.PI / 2);
    hangleTop.rotateY(Math.PI / 2);
    doorGroup.add(hangleTop);

    const hangleLeftRightTexture = this.textureLoader.load(`assets/textures/plastic/plastic.jpg`);

    hangleLeftRightTexture.wrapS = THREE.RepeatWrapping;
    hangleLeftRightTexture.wrapT = THREE.RepeatWrapping;

    hangleLeftRightTexture.repeat.set(.05, .02);

    const hangleLeftRightGeometry = new THREE.PlaneGeometry(.05, .02);

    const hangleLeftRightMaterial = new THREE.MeshStandardMaterial({
      map: hangleTopBottomTexture,
      side: THREE.FrontSide,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: .1
    });

    const hangleLeft = new THREE.Mesh(hangleLeftRightGeometry, hangleLeftRightMaterial);
    hangleLeft.position.set((ConstantHelper.cityDoorWidth / 2) - (.2 / 2) + (.02 / 2), (ConstantHelper.cityDoorHeight / 2) - .2 + (.02 / 2), -(.05 / 2));
    hangleLeft.rotateZ(Math.PI / 2);
    hangleLeft.rotateY(Math.PI / 2);
    hangleLeft.rotateX(Math.PI / 2);
    doorGroup.add(hangleLeft);

    const hangleRight = new THREE.Mesh(hangleLeftRightGeometry, hangleLeftRightMaterial);
    hangleRight.position.set((ConstantHelper.cityDoorWidth / 2) - (.2 / 2) - (.02 / 2), (ConstantHelper.cityDoorHeight / 2) - .2 + (.02 / 2), -(.05 / 2));
    hangleRight.rotateZ(-Math.PI / 2);
    hangleRight.rotateY(Math.PI / 2);
    hangleRight.rotateX(Math.PI / 2);
    doorGroup.add(hangleRight);

    const hangleFrontTexture = this.textureLoader.load(`assets/textures/plastic/plastic.jpg`);

    hangleFrontTexture.wrapS = THREE.RepeatWrapping;
    hangleFrontTexture.wrapT = THREE.RepeatWrapping;

    hangleFrontTexture.repeat.set(.02, .02);

    const hangleFrontGeometry = new THREE.PlaneGeometry(.02, .02);

    const hangleFrontMaterial = new THREE.MeshStandardMaterial({
      map: hangleTopBottomTexture,
      side: THREE.FrontSide,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: .1
    });

    const hangleFront = new THREE.Mesh(hangleFrontGeometry, hangleFrontMaterial);
    hangleFront.position.set((ConstantHelper.cityDoorWidth / 2) - (.2 / 2), (ConstantHelper.cityDoorHeight / 2) - .2 + (.02 / 2), -(.05 / 2) - (.05 / 2));
    hangleFront.rotateY(Math.PI);
    doorGroup.add(hangleFront);

    return doorGroup;
  }

  private createWindowsColumn(): THREE.Group {
    if (!this.windowsColumn) {
      const windowsGroup = new THREE.Group();
      windowsGroup.userData['type'] = 'windows-group';

      const floorsNumber: number = ConstantHelper.cityBuildingTopHeight / ConstantHelper.cityBuildingFloorHeight;
      let windowPositionY: number = ConstantHelper.cityBuildingBottomHeight + 1.3;

      for (let i = 0; i <= floorsNumber - 1; i++) {
        const window: THREE.Group = this.createWindow();
        window.position.set(0, windowPositionY, -ConstantHelper.cityBuildingTopPartOffset - .001);
        windowsGroup.add(window);

        windowPositionY += ConstantHelper.cityBuildingFloorHeight;
      }

      this.windowsColumn = windowsGroup;
      return windowsGroup;
    }
    else {
      return this.windowsColumn.clone();
    }
  }

  private createWindow(): THREE.Group {
    const windowGroup = new THREE.Group();
    windowGroup.userData['type'] = 'window-group';

    // window texture link: https://ambientcg.com/view?id=Plastic013A
    const bottomTopPartTexture = this.textureLoader.load(`assets/textures/plastic/plastic.jpg`);

    bottomTopPartTexture.wrapS = THREE.RepeatWrapping;
    bottomTopPartTexture.wrapT = THREE.RepeatWrapping;

    bottomTopPartTexture.repeat.set(ConstantHelper.cityWindowWidth, .15);

    const bottomTopPartGeometry = new THREE.PlaneGeometry(ConstantHelper.cityWindowWidth, .15);
    const bottomTopPartMaterial = new THREE.MeshStandardMaterial(
      {
        map: bottomTopPartTexture,
        side: THREE.FrontSide,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 1
      }
    );

    const bottomPart = new THREE.Mesh(bottomTopPartGeometry, bottomTopPartMaterial);
    bottomPart.rotation.y = Math.PI;
    bottomPart.position.set(0, (.15 / 2), 0);
    bottomPart.userData['type'] = 'window-part';
    windowGroup.add(bottomPart);

    const topPart = new THREE.Mesh(bottomTopPartGeometry, bottomTopPartMaterial);
    topPart.rotation.y = Math.PI;
    topPart.position.set(0, ConstantHelper.cityWindowHeight - (.15 / 2), 0);
    topPart.userData['type'] = 'window-part';
    windowGroup.add(topPart);

    const leftRightPartTexture = this.textureLoader.load(`assets/textures/plastic/plastic.jpg`);

    leftRightPartTexture.wrapS = THREE.RepeatWrapping;
    leftRightPartTexture.wrapT = THREE.RepeatWrapping;

    leftRightPartTexture.repeat.set(.15, ConstantHelper.cityWindowHeight - (2 * .15));

    const leftRightPartGeometry = new THREE.PlaneGeometry(.15, ConstantHelper.cityWindowHeight - (2 * .15));
    const leftRightPartMaterial = new THREE.MeshStandardMaterial(
      {
        map: leftRightPartTexture,
        side: THREE.FrontSide,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 1
      }
    );

    const leftPart = new THREE.Mesh(leftRightPartGeometry, leftRightPartMaterial);
    leftPart.rotation.y = Math.PI;
    leftPart.position.set((ConstantHelper.cityWindowWidth / 2) - (.15 / 2), ConstantHelper.cityWindowHeight / 2, 0);
    leftPart.userData['type'] = 'window-part';
    windowGroup.add(leftPart);

    const rightPart = new THREE.Mesh(leftRightPartGeometry, leftRightPartMaterial);
    rightPart.rotation.y = Math.PI;
    rightPart.position.set(-(ConstantHelper.cityWindowWidth / 2) + (.15 / 2), ConstantHelper.cityWindowHeight / 2, 0);
    rightPart.userData['type'] = 'window-part';
    windowGroup.add(rightPart);

    const mirrorGeometry = new THREE.PlaneGeometry(ConstantHelper.cityWindowWidth - (2 * .15), ConstantHelper.cityWindowHeight - (2 * .15));

    const mirrorMaterial = new THREE.MeshStandardMaterial({
      side: THREE.FrontSide,
      color: 0xababab,
      metalness: .7,
      roughness: .1,
      envMap: this.mirrorCamera!.renderTarget.texture,
      envMapIntensity: 1
    });

    const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    mirror.rotateY(Math.PI);
    mirror.position.set(0, ConstantHelper.cityWindowHeight / 2, 0);

    windowGroup.add(mirror);

    return windowGroup;
  }

  private createBuildingFloors(): THREE.Group {
    const buildingFloorsGroup = new THREE.Group();
    buildingFloorsGroup.userData['type'] = 'building-floors-group';

    // builing floor texture link: https://ambientcg.com/view?id=Tiles136A
    const frontRearBigFloorTexture = this.textureLoader.load(`assets/textures/building-floor/building-floor.jpg`);

    frontRearBigFloorTexture.wrapS = THREE.RepeatWrapping;
    frontRearBigFloorTexture.wrapT = THREE.RepeatWrapping;

    frontRearBigFloorTexture.repeat.set(this.width!, ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth);

    const frontRearBigFloorGeometry = new THREE.PlaneGeometry(this.width!, ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth);
    const frontRearBigFloorMaterial = new THREE.MeshStandardMaterial({ map: frontRearBigFloorTexture, side: THREE.FrontSide });

    const frontBigFloor = new THREE.Mesh(frontRearBigFloorGeometry, frontRearBigFloorMaterial);
    frontBigFloor.rotation.x = -Math.PI / 2;
    frontBigFloor.position.set(0, ConstantHelper.citySidewalkHeight - .01, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.citySidewalkWidth) / 2));
    frontBigFloor.userData['type'] = 'building';
    buildingFloorsGroup.add(frontBigFloor);

    const rearBigFloor = new THREE.Mesh(frontRearBigFloorGeometry, frontRearBigFloorMaterial);
    rearBigFloor.rotation.x = -Math.PI / 2;
    rearBigFloor.position.set(0, ConstantHelper.citySidewalkHeight - .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.citySidewalkWidth) / 2));
    rearBigFloor.userData['type'] = 'building';
    buildingFloorsGroup.add(rearBigFloor);

    const leftRightBigFloorTexture = this.textureLoader.load(`assets/textures/building-floor/building-floor.jpg`);

    leftRightBigFloorTexture.wrapS = THREE.RepeatWrapping;
    leftRightBigFloorTexture.wrapT = THREE.RepeatWrapping;
    leftRightBigFloorTexture.rotation = Math.PI / 2;
    leftRightBigFloorTexture.repeat.set(this.depth!, ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth);

    const leftRightBigFloorGeometry = new THREE.PlaneGeometry(ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth, this.depth!);
    const leftRightBigFloorMaterial = new THREE.MeshStandardMaterial({ map: leftRightBigFloorTexture, side: THREE.FrontSide });

    const leftBigFloor = new THREE.Mesh(leftRightBigFloorGeometry, leftRightBigFloorMaterial);
    leftBigFloor.rotation.x = -Math.PI / 2;
    leftBigFloor.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight - .01, 0);
    leftBigFloor.userData['type'] = 'building';
    buildingFloorsGroup.add(leftBigFloor);

    const rightBigFloor = new THREE.Mesh(leftRightBigFloorGeometry, leftRightBigFloorMaterial);
    rightBigFloor.rotation.x = -Math.PI / 2;
    rightBigFloor.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight - .01, 0);
    rightBigFloor.userData['type'] = 'building';
    buildingFloorsGroup.add(rightBigFloor);

    const smallFloorTexture = this.textureLoader.load(`assets/textures/building-floor/building-floor.jpg`);

    smallFloorTexture.wrapS = THREE.RepeatWrapping;
    smallFloorTexture.wrapT = THREE.RepeatWrapping;

    smallFloorTexture.repeat.set(ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth, ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth);

    const smallFloorGeometry = new THREE.PlaneGeometry(ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth, ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth);
    const smallFloorMaterial = new THREE.MeshStandardMaterial({ map: smallFloorTexture, side: THREE.FrontSide });

    const frontLeftSmallFloor = new THREE.Mesh(smallFloorGeometry, smallFloorMaterial);
    frontLeftSmallFloor.rotation.x = -Math.PI / 2;
    frontLeftSmallFloor.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight - .01, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.citySidewalkWidth) / 2));
    frontLeftSmallFloor.userData['type'] = 'building';
    buildingFloorsGroup.add(frontLeftSmallFloor);

    const frontRightSmallFloor = new THREE.Mesh(smallFloorGeometry, smallFloorMaterial);
    frontRightSmallFloor.rotation.x = -Math.PI / 2;
    frontRightSmallFloor.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight - .01, -(this.depth! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.citySidewalkWidth) / 2));
    frontRightSmallFloor.userData['type'] = 'building';
    buildingFloorsGroup.add(frontRightSmallFloor);

    const rearLeftSmallFloor = new THREE.Mesh(smallFloorGeometry, smallFloorMaterial);
    rearLeftSmallFloor.rotation.x = -Math.PI / 2;
    rearLeftSmallFloor.position.set((this.width! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight - .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.citySidewalkWidth) / 2));
    rearLeftSmallFloor.userData['type'] = 'building';
    buildingFloorsGroup.add(rearLeftSmallFloor);

    const rearRightSmallFloor = new THREE.Mesh(smallFloorGeometry, smallFloorMaterial);
    rearRightSmallFloor.rotation.x = -Math.PI / 2;
    rearRightSmallFloor.position.set(-(this.width! / 2) - ConstantHelper.citySidewalkWidth - ConstantHelper.cityGrassWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityStreetWidth - ConstantHelper.cityKerbWidth - ConstantHelper.cityGrassWidth - ConstantHelper.citySidewalkWidth - ((ConstantHelper.citySidewalkWidth) / 2), ConstantHelper.citySidewalkHeight - .01, (this.depth! / 2) + ConstantHelper.citySidewalkWidth + ConstantHelper.cityGrassWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityStreetWidth + ConstantHelper.cityKerbWidth + ConstantHelper.cityGrassWidth + ConstantHelper.citySidewalkWidth + ((ConstantHelper.citySidewalkWidth) / 2));
    rearRightSmallFloor.userData['type'] = 'building';
    buildingFloorsGroup.add(rearRightSmallFloor);

    return buildingFloorsGroup;
  }
}
