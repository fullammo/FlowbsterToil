import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {

  constructor() { }

  confirm(message?: string) {
    return Observable.of(window.confirm(message || 'Is it Ok?'));
  }
}
