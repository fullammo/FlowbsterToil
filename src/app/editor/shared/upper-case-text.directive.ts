import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

/**
 * A simple directive to change the forms ngModel input into UpperCase characters
 * @example
 * <input [(ngModel)]="inputProp" [toilUpperCase]>
 */
@Directive({
  selector: '[ngModel][toilUpperCase]'
})
export class UpperCaseTextDirective {

  /**
   * Emits events whenever the ngModel property changes.
   */
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

  /**
   * Whenever a KeyBoard Event happens its going to set it to uppercase and emits the value.
   * @param event An event about the user keyboard usage.
   */
  @HostListener('input', ['$event']) onInputChange(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    this.ngModelChange.emit(input.value.toUpperCase());
  }
}
