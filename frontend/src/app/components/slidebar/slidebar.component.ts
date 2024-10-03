import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-slidebar',
  templateUrl: './slidebar.component.html',
  styleUrls: ['./slidebar.component.scss']
})
export class SlidebarComponent implements OnInit, OnDestroy {
  @Input() images: string[] = [];
  @Input() displayOneSlideSeconds: number = 4;

  private currentIndex = 0;
  private isTransitioning = true;
  private intervalId: any;

  constructor() { }

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  public getSlideTransform() {
    return `translateX(-${this.currentIndex * 820}px)`;
  }

  public getSlideTransition() {
    return this.isTransitioning ? 'transform 0.5s ease-in-out' : 'none';
  }

  public handleTransitionEnd() {
    if (this.currentIndex === this.images.length) {
      this.isTransitioning = false;
      this.currentIndex = 0;
    }
  }

  public getDisplayIndex() {
    return this.currentIndex === this.images.length ? 0 : this.currentIndex;
  }

  public goToSlide(index: number) {
    this.currentIndex = index;
    clearInterval(this.intervalId);
    this.startAutoSlide();
  }

  private startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, this.displayOneSlideSeconds * 1000);
  }

  private nextSlide() {
    if (this.currentIndex === this.images.length) {
      this.isTransitioning = false;
      this.currentIndex = 0;
    }
    else {
      this.isTransitioning = true;
      this.currentIndex++;
    }
  }
}
