import {
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import { ScreenService } from '../services/screen.service';
import { Subscription } from 'rxjs/Subscription';

/**
 * A Directive to set the screen adjusment on smaller window sizes on different HTML elements.
 */
@Directive({ selector: '[screenBelowLarge]' })
export class ScreenBelowLarge implements OnDestroy {

  /**
   * Indicator to check wether the Element has a viewContainer. In default it hasnt got one.
   */
  private hasView = false;

  /**
   * An event stream that informs us about screen adjustments.
   */
  private screenSubscription: Subscription;

  /**
   * Initialize the needed services and enlists on resize events.
   */
  constructor(
    private viewContainer: ViewContainerRef,
    private template: TemplateRef<Object>,
    private screenService: ScreenService
  ) {
    this.screenSubscription = screenService.resize$.subscribe(() =>
      this.onResize()
    );
  }

  /**
   * Whenever the screenwidth is below the large breakpoint and there isnt a view specified,
   * it creates an embedded view of the actual elements template.
   * Otherwise it clears the actual viewContainer and sets the default indicators.
   */
  @Input()
  set screenBelowLarge(condition) {
    // ignore the passed condition and set it based on screen size
    condition =
      this.screenService.screenWidth < this.screenService.largeBreakpoint;

    if (condition && !this.hasView) {
      this.hasView = true;
      this.viewContainer.createEmbeddedView(this.template);
    } else if (!condition && this.hasView) {
      this.hasView = false;
      this.viewContainer.clear();
    }
  }

  /**
   * Delist from the screen changing events.
   */
  ngOnDestroy() {
    this.screenSubscription.unsubscribe();
  }

  /**
   * Whenever the screen gets resized to a large device it sets the indicator for mobile devices.
   */
  onResize() {
    // trigger the setter
    this.screenBelowLarge = false;
  }
}
