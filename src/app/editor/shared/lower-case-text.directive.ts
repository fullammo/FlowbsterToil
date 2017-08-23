import { Directive, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[ngModel][toilLowerCase]'
})
export class LowerCaseTextDirective {

  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    this.ngModelChange.emit(input.value.toLowerCase());
  }

  constructor() { }

}
