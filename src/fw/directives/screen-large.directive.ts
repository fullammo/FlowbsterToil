import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';

import { ScreenService } from '../services/screen.service';
import { Subscription } from 'rxjs/Subscription';

/**
 * A Directive to set the component adjusment on large window sizes on different HTML elements.
 */
@Directive({selector: '[screenLarge]'})
export class ScreenLarge implements OnDestroy {

  /**
   * Indicates if the tagged HTML element has a view Container.
   */
  private hasView = false;

  /**
   * Screen event based subscriptions.
   */
  private screenSubscription: Subscription;

  /**
   * Initializes the needed services and references, Enlists to the screen changing events.
   */
  constructor(private viewContainer: ViewContainerRef,
                private template: TemplateRef<Object>,
                private screenService: ScreenService) {

    this.screenSubscription = screenService.resize$.subscribe(() => this.onResize());

  }

  /**
   * Whenever the screenwidth is higher than the large breakpoint and there isnt a view specified,
   * it creates an embedded view of the actual elements template.
   * Otherwise it clears the actual viewContainer and sets the default indicators.
   */
  @Input()
  set screenLarge(condition) {
    // ignore the passed condition and set it based on screen size
    condition = this.screenService.screenWidth >= this.screenService.largeBreakpoint;

    if (condition && !this.hasView) {
      this.hasView = true;
      this.viewContainer.createEmbeddedView(this.template);
    } else if (!condition && this.hasView) {
      this.hasView = false;
      this.viewContainer.clear();
    }
  }

  /**
   * Delist from the screen changes event.
   */
  ngOnDestroy() {
    this.screenSubscription.unsubscribe();
  }

  /**
   * Whenever the screen size is under the border values the large screen indicator is set to false.
   */
  onResize() {
    // trigger the setter
    this.screenLarge = false;
  }
}
