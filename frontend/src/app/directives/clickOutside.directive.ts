import { DOCUMENT } from "@angular/common";
import { AfterViewInit, Directive, ElementRef, EventEmitter, Inject, OnDestroy, Output } from "@angular/core";
import { Subscription, filter, fromEvent } from "rxjs";

@Directive({
    selector: '[clickOutside]'
})

export class ClickOutsideDirective implements AfterViewInit, OnDestroy {
    @Output() clickOutside = new EventEmitter<void>();

    documentClickSubsciption: Subscription | undefined;

    constructor(
        private element: ElementRef,
        @Inject(DOCUMENT) private document: Document
    ) { }

    ngOnDestroy(): void {
        this.documentClickSubsciption?.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.documentClickSubsciption = fromEvent(this.document, 'click')
            .pipe(
                filter((event) => {
                    return !this.isInside(event.target as HTMLElement);
                })
            )
            .subscribe(() => {
                this.clickOutside.emit();
            });
    }

    isInside(elementToCheck: HTMLElement): boolean {
        return (
            elementToCheck === this.element.nativeElement || this.element.nativeElement.contains(elementToCheck)
        );
    }
}