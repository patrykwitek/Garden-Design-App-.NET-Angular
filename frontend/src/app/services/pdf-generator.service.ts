import { Injectable, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf';
import { EngineService } from './engine.service';
import * as THREE from 'three';
import { GardenService } from './garden.service';
import { IProject } from '../models/interfaces/i-project';
import '../../assets/fonts/OpenSans-Bold.js';
import '../../assets/fonts/OpenSans-Regular.js';
import { ConstantHelper } from '../utils/constant-helper';
import { IGardenElement } from '../models/interfaces/i-garden-element';
import { IEntrance } from '../models/interfaces/i-entrance';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  private pdfCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera | undefined;
  private pdfRenderer: THREE.WebGLRenderer | undefined;
  private renderTarget: THREE.WebGLRenderTarget | undefined;
  private pdfScene: THREE.Scene | undefined;

  private currentProject: IProject | undefined;

  constructor(
    private engineService: EngineService,
    private gardenService: GardenService
  ) { }

  public async generatePDF(): Promise<void> {
    await this.initializePdfGeneratorService();

    this.adjustLightIntensityForPdfRender();

    const doc = new jsPDF();

    const pageWidth: number = doc.internal.pageSize.getWidth();
    const pageHeight: number = doc.internal.pageSize.getHeight();

    const imgWidth: number = 200;
    const imgHeight: number = 120;
    const centeredX: number = (pageWidth - imgWidth) / 2;

    // 1st page
    // header
    doc.setFont('OpenSans-Regular', 'normal');
    doc.setFontSize(20);
    const projectTitle = this.currentProject!.name;

    doc.text(projectTitle, centeredX, 20);

    doc.text('- garden project documentation', centeredX + doc.getTextWidth(projectTitle) + 2, 20);

    // width x depth
    const width: number = this.currentProject!.width;
    const depth: number = this.currentProject!.depth;

    doc.setFontSize(10);
    doc.text(width + 'm x ' + depth + 'm', centeredX, 28);

    // general information
    doc.setFont('OpenSans-Bold', 'normal');
    doc.setFontSize(12);
    doc.text('General information', centeredX, 45);

    doc.setFont('OpenSans-Regular', 'normal');
    doc.setFontSize(10);

    const groundText: string = 'Ground type:';
    doc.text(groundText, centeredX, 52);
    doc.text(this.currentProject!.ground.name, centeredX + doc.getTextWidth(groundText) + 2, 52);

    const fenceText: string = 'Fence type:';
    doc.text(fenceText, centeredX, 59);
    doc.text(this.currentProject!.fence.name, centeredX + doc.getTextWidth(fenceText) + 2, 59);

    const environmentText: string = 'Environment:';
    doc.text(environmentText, centeredX, 66);
    doc.text(this.currentProject!.environment.name, centeredX + doc.getTextWidth(environmentText) + 2, 66);

    // Preview screen
    const previewScreenshotUncoloured: string = this.getScreenshot('preview');
    const previewScreenshot = await this.getScreenshotWithContrastAdjustment(previewScreenshotUncoloured);

    doc.text('Preview', centeredX, 83);
    doc.addImage(previewScreenshot, 'PNG', centeredX, 85, imgWidth, imgHeight);

    doc.text('Page 1', pageWidth - 20, pageHeight - 10);

    // 2nd page
    doc.addPage();

    // elements detials
    doc.setFont('OpenSans-Bold', 'normal');
    doc.setFontSize(12);
    doc.text('Elements details', centeredX, 20);

    doc.setFont('OpenSans-Regular', 'normal');
    doc.setFontSize(10);

    let startElementPositionY: number = 27;

    try {
      const gardenElementsList: IGardenElement[] | undefined = await this.engineService.getElementsForGarden(this.currentProject?.id).toPromise();

      const elementCount = gardenElementsList!.reduce((accumulator, element) => {
        const wartoscDoDodania = element.category === 'Pavement' ? Math.pow(ConstantHelper.entranceWidth, 2) : 1;
        accumulator[element.name] = (accumulator[element.name] || 0) + wartoscDoDodania;
        return accumulator;
      }, {} as Record<string, number>);

      const elementCountWithUnit = Object.fromEntries(
        Object.entries(elementCount).map(([key, value]) => {
          const isPavement = gardenElementsList!.some(element => element.name === key && element.category === 'Pavement');
          return [key, isPavement ? `${value.toFixed(2)} m2` : value];
        })
      );

      Object.entries(elementCountWithUnit).forEach(([key, value]) => {
        const elementName: string = key;
        doc.text(elementName + ":", centeredX, startElementPositionY);
        doc.text(value.toString(), centeredX + doc.getTextWidth(elementName + ":") + 2, startElementPositionY);
        startElementPositionY += 7;
      });

    } catch (error) {
      console.error('Error loading garden elements: ', error);
    }

    // entrances
    startElementPositionY += 10;
    doc.setFont('OpenSans-Bold', 'normal');
    doc.setFontSize(12);
    doc.text('Entrances', centeredX, startElementPositionY);

    startElementPositionY += 7;
    doc.setFont('OpenSans-Regular', 'normal');
    doc.setFontSize(10);

    try {
      const gardenEntrances: IEntrance[] | undefined = await this.engineService.getEntrancesForProject(this.currentProject?.id).toPromise();

      const northEntrances = gardenEntrances!.filter(entrance => entrance.direction === 'North');
      const southEntrances = gardenEntrances!.filter(entrance => entrance.direction === 'South');
      const eastEntrances = gardenEntrances!.filter(entrance => entrance.direction === 'East');
      const westEntrances = gardenEntrances!.filter(entrance => entrance.direction === 'West');

      if (northEntrances.length !== 0) {
        const entranceDirection = 'North';
        doc.text(entranceDirection + ":", centeredX, startElementPositionY);
        doc.text(northEntrances.length.toString(), centeredX + doc.getTextWidth(entranceDirection + ":") + 2, startElementPositionY);
        startElementPositionY += 5;

        const PositionsText = 'Positions';
        doc.text(PositionsText + ":", centeredX, startElementPositionY);

        let northEntrancesPositions: string = '';
        for (let i = 0; i < northEntrances.length; i++) {
          if (i === northEntrances.length - 1) northEntrancesPositions += northEntrances[i].position;
          else northEntrancesPositions += (northEntrances[i].position + ', ');
        }

        doc.text(northEntrancesPositions, centeredX + doc.getTextWidth(PositionsText + ":") + 2, startElementPositionY);
        startElementPositionY += 7;
      }

      if (southEntrances.length !== 0) {
        const entranceDirection = 'South';
        doc.text(entranceDirection + ":", centeredX, startElementPositionY);
        doc.text(southEntrances.length.toString(), centeredX + doc.getTextWidth(entranceDirection + ":") + 2, startElementPositionY);
        startElementPositionY += 5;

        const PositionsText = 'Positions';
        doc.text(PositionsText + ":", centeredX, startElementPositionY);

        let southEntrancesPositions: string = '';
        for (let i = 0; i < southEntrances.length; i++) {
          if (i === southEntrances.length - 1) southEntrancesPositions += southEntrances[i].position;
          else southEntrancesPositions += (southEntrances[i].position + ', ');
        }

        doc.text(southEntrancesPositions, centeredX + doc.getTextWidth(PositionsText + ":") + 2, startElementPositionY);
        startElementPositionY += 7;
      }

      if (eastEntrances.length !== 0) {
        const entranceDirection = 'East';
        doc.text(entranceDirection + ":", centeredX, startElementPositionY);
        doc.text(eastEntrances.length.toString(), centeredX + doc.getTextWidth(entranceDirection + ":") + 2, startElementPositionY);
        startElementPositionY += 5;

        const PositionsText = 'Positions';
        doc.text(PositionsText + ":", centeredX, startElementPositionY);

        let eastEntrancesPositions: string = '';
        for (let i = 0; i < eastEntrances.length; i++) {
          if (i === eastEntrances.length - 1) eastEntrancesPositions += eastEntrances[i].position;
          else eastEntrancesPositions += (eastEntrances[i].position + ', ');
        }

        doc.text(eastEntrancesPositions, centeredX + doc.getTextWidth(PositionsText + ":") + 2, startElementPositionY);
        startElementPositionY += 7;
      }

      if (westEntrances.length !== 0) {
        const entranceDirection = 'West';
        doc.text(entranceDirection + ":", centeredX, startElementPositionY);
        doc.text(westEntrances.length.toString(), centeredX + doc.getTextWidth(entranceDirection + ":") + 2, startElementPositionY);
        startElementPositionY += 5;

        const PositionsText = 'Positions';
        doc.text(PositionsText + ":", centeredX, startElementPositionY);

        let westEntrancesPositions: string = '';
        for (let i = 0; i < westEntrances.length; i++) {
          if (i === westEntrances.length - 1) westEntrancesPositions += westEntrances[i].position;
          else westEntrancesPositions += (westEntrances[i].position + ', ');
        }

        doc.text(westEntrancesPositions, centeredX + doc.getTextWidth(PositionsText + ":") + 2, startElementPositionY);
        startElementPositionY += 7;
      }
    } catch (error) {
      console.error('Error loading entrances: ', error);
    }

    doc.text('Page 2', pageWidth - 20, pageHeight - 10);

    // 3rd page
    doc.addPage();

    doc.setFont('OpenSans-Bold', 'normal');
    doc.setFontSize(12);
    doc.text('Visualisation', centeredX, 10);

    // front view screen
    doc.setFont('OpenSans-Regular', 'normal');
    doc.setFontSize(10);
    doc.text('Front view', centeredX, 20);

    const frontViewScreenshotUncoloured: string = this.getScreenshot('front');
    const frontViewScreenshot = await this.getScreenshotWithContrastAdjustment(frontViewScreenshotUncoloured);

    doc.addImage(frontViewScreenshot, 'PNG', centeredX, 22, imgWidth, imgHeight);

    // top view screen
    const topViewScreenshotUncoloured: string = this.getScreenshot('top');
    const topViewScreenshot = await this.getScreenshotWithContrastAdjustment(topViewScreenshotUncoloured);

    const secondScreenshotYPosition = 26 + imgHeight + 10

    doc.text('Top view', centeredX, secondScreenshotYPosition);
    doc.addImage(topViewScreenshot, 'PNG', centeredX, secondScreenshotYPosition + 2, imgWidth, imgHeight);

    doc.text('Page 3', pageWidth - 20, pageHeight - 10);

    doc.save(this.currentProject!.name);

    this.resetPdfGeneratorService();
  }

  private initializePdfGeneratorService(): void {
    this.currentProject = this.gardenService.getCurrentProject();

    if (this.currentProject === undefined) throw new Error('No project selected');

    this.initializePdfScene();
  }

  private initializePdfScene(): void {
    const originalScene = this.engineService.getScene();

    this.pdfScene = new THREE.Scene();
    this.pdfScene.background = originalScene.background;

    originalScene.children.forEach(child => {
      const clonedChild = child.clone();
      this.pdfScene!.add(clonedChild);
    });
  }

  private getScreenshot(perspective: 'front' | 'top' | 'preview'): string {
    if (!this.pdfRenderer) this.initializePdfRenderer();
    this.initializePdfCamera(perspective);

    if (!this.pdfRenderer || !this.pdfRenderer || !this.renderTarget || !this.pdfCamera || !this.pdfScene) {
      throw new Error('Options undefined');
    }

    const width = this.renderTarget.width;
    const height = this.renderTarget.height;
    const buffer = new Uint8Array(width * height * 4);

    this.pdfRenderer.setRenderTarget(this.renderTarget);
    this.pdfRenderer.render(this.pdfScene, this.pdfCamera);
    this.pdfRenderer.readRenderTargetPixels(this.renderTarget, 0, 0, width, height, buffer);

    const flippedBuffer = this.flipBufferVertically(buffer, width, height);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    const imageData = context!.createImageData(width, height);

    imageData.data.set(flippedBuffer);
    context!.putImageData(imageData, 0, 0);

    const dataURL = canvas.toDataURL('image/png');
    this.pdfRenderer.setRenderTarget(null);

    this.pdfCamera = undefined;

    return dataURL;
  }

  private getScreenshotWithContrastAdjustment(screenshotData: string): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();

    canvas.width = this.renderTarget!.width;
    canvas.height = this.renderTarget!.height;

    return new Promise<string>((resolve) => {
      image.onload = () => {
        ctx!.filter = 'contrast(85%) brightness(110%)';
        ctx!.drawImage(image, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      image.src = screenshotData;
    });
  }

  private flipBufferVertically(buffer: Uint8Array, width: number, height: number): Uint8Array {
    const flippedBuffer = new Uint8Array(buffer.length);
    const rowSize = width * 4;

    for (let y = 0; y < height; y++) {
      const sourceRow = y * rowSize;
      const targetRow = (height - y - 1) * rowSize;
      for (let x = 0; x < rowSize; x++) {
        flippedBuffer[targetRow + x] = buffer[sourceRow + x];
      }
    }

    return flippedBuffer;
  }

  private initializePdfRenderer(): void {
    this.renderTarget = new THREE.WebGLRenderTarget(2560, 1440, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
    });

    this.pdfRenderer = this.engineService.getRenderer();
  }

  private initializePdfCamera(perspective: 'front' | 'top' | 'preview'): void {
    const aspectRatio = this.renderTarget!.width / this.renderTarget!.height;

    if (perspective === 'front') {
      this.pdfCamera = new THREE.PerspectiveCamera(
        75,
        aspectRatio,
        0.1,
        1000
      );

      this.pdfCamera.position.set(0, 5, -(this.currentProject!.depth / 2) - (this.currentProject!.width / 3));
      this.pdfCamera.aspect = aspectRatio;
      this.pdfCamera.lookAt(0, 0, 0);
    }
    else if (perspective === 'top' || perspective === 'preview') {
      this.pdfCamera = new THREE.OrthographicCamera(
        -window.innerWidth / (2 * ConstantHelper.orthographicCameraZoomFactor),
        window.innerWidth / (2 * ConstantHelper.orthographicCameraZoomFactor),
        window.innerHeight / (2 * ConstantHelper.orthographicCameraZoomFactor),
        -window.innerHeight / (2 * ConstantHelper.orthographicCameraZoomFactor),
        0.1,
        1000
      );

      if (perspective === 'top') {
        this.pdfCamera.position.set(0, 30, 0);
        this.pdfCamera.up.set(0, 0, 1);
        this.pdfCamera.lookAt(0, 0, 0);
      }
      else if (perspective === 'preview') {
        this.pdfCamera.position.set(-(this.currentProject!.width / 2) - 10, 10, -(this.currentProject!.depth / 2) - 20);
        this.pdfCamera.up.set(0, 1, 0);
        this.pdfCamera.lookAt(0, 2, 0);
      }
    }

    this.pdfCamera!.updateProjectionMatrix();
  }

  private adjustLightIntensityForPdfRender(): void {
    const lights = this.pdfScene?.children.filter(object => object instanceof THREE.Light) as THREE.Light[];
    lights.forEach(light => {
      if (light instanceof THREE.AmbientLight) {
        light.intensity = 2;
        light.color.setHex(0x505050);
      } else if (light instanceof THREE.DirectionalLight) {
        light.intensity = 2;
        light.color.setHex(0xdddddd);
      }
    });
  }

  private resetPdfGeneratorService(): void {
    this.pdfCamera = undefined;
    this.pdfRenderer = undefined;
    this.renderTarget = undefined;
    this.pdfScene = undefined;

    this.currentProject = undefined;

    this.restoreOriginalLightIntensity();
  }

  private restoreOriginalLightIntensity(): void {
    this.engineService.setLightSettings();
  }
}
