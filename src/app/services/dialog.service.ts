import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

/**
 * A service that holds logic about different dialog components.
 */
@Injectable()
export class DialogService {

  /**
   * Creates a window confirmation dialog with the given message.
   * @param message The text you want to output to the confirmation modal.
   * @returns an Observable of the basic confirmation function.
   */
  confirm(message?: string) {
    return Observable.of(window.confirm(message || 'Is it Ok?'));
  }
}
