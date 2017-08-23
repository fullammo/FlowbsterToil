import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[toilUpperCaseText]'
})
export class UpperCaseTextDirective {

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    this.ref.nativeElement.value = input.value.toUpperCase();
  }

  constructor(private ref: ElementRef) { }

}
