import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[ngModel][toilUppercase]'
})
export class UpperCaseTextDirective {

  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

  @HostListener('input', ['$event']) onInputChange(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    this.ngModelChange.emit(input.value.toUpperCase());
  }

  constructor() { }

}
