import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[toilLowerCaseText]'
})
export class LowerCaseTextDirective {

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    this.ref.nativeElement.value = input.value.toLowerCase();
  }

  constructor(private ref: ElementRef) { }

}
