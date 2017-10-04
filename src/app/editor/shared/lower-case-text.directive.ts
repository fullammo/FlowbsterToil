import { Directive, HostListener, EventEmitter, Output } from '@angular/core';

/**
 * A simple directive to change the forms ngModel input into lowercase characters
 * @example
 * <input [(ngModel)]="inputProp" [toilLowerCase]>
 */
@Directive({
  selector: '[ngModel][toilLowerCase]'
})
export class LowerCaseTextDirective {

  /**
   * Emits events whenever the ngModel property changes.
   */
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

  /**
   * Whenever a KeyBoard Event happens its going to set it to lowercase and emits the value.
   * @param event An event about the user keyboard usage.
   */
  @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    this.ngModelChange.emit(input.value.toLowerCase());
  }
}
