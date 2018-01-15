import { HostListener, Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/**
 * The basic logic of the Screen adjustment functionalities and data.
 */
@Injectable()
export class ScreenService {

  /**
   * An event stream based on resize data.
   */
  private resizeSource = new Subject<null>();

  /**
   * A subscribable resize data stream.
   */
  resize$ = this.resizeSource.asObservable();

  /**
   * The breakpoint value for measuring large devices.
   */
  largeBreakpoint = 800;

  /**
   * The value of the width of the screen.
   */
  screenWidth = 1000;

  /**
   * The value of the height of the screen.
   */
  screenHeight = 800;

  /**
   * Sets the width and height of the screen settings to the window objects values and enlists on the resize event to feed the data stream.
   */
  constructor() {
    try {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      window.addEventListener('resize', event => this.onResize(event));
    } catch (e) {
      // we're going with default screen dimensions
    }
  }

  /**
   * Decides wether the actual screen width is larger than the defined large measure breakpoint.
   */
  isLarge(): boolean {
    return this.screenWidth >= this.largeBreakpoint;
  }

  /**
   * Whenever the window gets resized the width and the height of the screen gets reconfigured and emits an event about the resizing.
   * @param
   */
  onResize($event): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.resizeSource.next();
  }
}
