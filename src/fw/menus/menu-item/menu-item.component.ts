import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Renderer,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { MenuItem, MenuService } from '../../services/menu.service';

/**
 * Holds the logic for rendering and animating a menu item in the navigation menu.
 * Taking into consideration the layout preference of the user.
 */
@Component({
  selector: 'fw-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
  animations: [
    trigger('visibilityChanged', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(250, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        // :leave is alias to '* => void'
        animate(100, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MenuItemComponent implements OnInit {
  /**
   * List of Menu Items that is provided by the parent component.
   */
  @Input() item = <MenuItem>null; // see angular-cli issue #2034

  /**
   * An indicator specified from the parent component which decides if the parent is a popup menu item.
   * Also modifies the parents parent-is-popup css class.
   * On Default the parent component is a popup menu item.
   */
  @HostBinding('class.parent-is-popup')
  @Input()
  parentIsPopup = true;

  /**
   *Indicates if the actual menu item has an activated subroute. On default it is not an activated route.
   */
  isActiveRoute = false;

  /**
   * Indicates wether the mouse cursor position is in the Item's view port.
   */
  mouseInItem = false;

  /**
   * Indicates wether the mouse cursor position is in a Popup menu's viewport.
   */
  mouseInPopup = false;

  /**
   * The popup menu items aligment on the left side.
   */
  popupLeft = 0;

  /**
   * The popup menu items alignment from the top side.
   */
  popupTop = 34;

  /**
   * Initialize the needed services.
   * @param menuService The functionality provided to interact with the nagivation services.
   */
  constructor(
    private router: Router,
    public menuService: MenuService,
    private el: ElementRef,
    private renderer: Renderer
  ) {}

  /**
   * Sets the active route indicator based on the actual menu items route.
   * @param route the fully quilified URL path of the demanded route.
   */
  checkActiveRoute(route: string) {
    this.isActiveRoute = route == '/' + this.item.route;
  }

  /**
   * Checks the actually used route for activation, and enlists on router events to continue searching.
   */
  ngOnInit(): void {
    this.checkActiveRoute(this.router.url);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkActiveRoute(event.url);
        // console.log(event.url + ' ' + this.item.route + ' ' + this.isActiveRoute);
      }
    });
  }

  /**
   * Catches the host click event and handles it by checking the orientation based on if this item has a submenu or not.
   * And naviagtes to the declared route.
   * @param event The click event propagated from the parent element.
   */
  @HostListener('click', ['$event'])
  onClick(event): void {
    event.stopPropagation();

    if (this.item.submenu) {
      if (this.menuService.isVertical) {
        this.mouseInPopup = !this.mouseInPopup;
      }
    } else if (this.item.route) {
      // force horizontal menus to close by sending a mouseleave event
      let newEvent = new MouseEvent('mouseleave', { bubbles: true });
      this.renderer.invokeElementMethod(
        this.el.nativeElement,
        'dispatchEvent',
        [newEvent]
      );

      this.router.navigate(['/' + this.item.route]);
    }
  }

  /**
   * Handles the Popup mouse enter event by setting the related indicator to true
   * @param event
   */
  onPopupMouseEnter(event): void {
    if (!this.menuService.isVertical) {
      this.mouseInPopup = true;
    }
  }

  /**
   * Handles the Popup mouse leave event by setting the related indicator to false when the menu is horizontal.
   * @param event
   */
  onPopupMouseLeave(event): void {
    if (!this.menuService.isVertical) {
      this.mouseInPopup = false;
    }
  }

  /**
   *Catches the mouseleave event from the parent HTML element and changes the related indicator to false when the menu is vertical.
   * @param event
   */
  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event): void {
    if (!this.menuService.isVertical) {
      this.mouseInItem = false;
    }
  }

  /**
   * Catches the mouseenter event from the parent HTML element
   * and changes the related indicator and popup parameters based on the menu context.
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.menuService.isVertical) {
      if (this.item.submenu) {
        this.mouseInItem = true;
        if (this.parentIsPopup) {
          this.popupLeft = 160;
          this.popupTop = 0;
        }
      }
    }
  }
}
