import { Injectable } from '@angular/core';

/**
 * Represents a navigation menu Item.
 */
export interface MenuItem {
  /**
   * The text shown to the user in the navigation menu.
   */
  text: string;

  /**
   * The icon that is represented besides the navigation item's text.
   */
  icon: string;

  /**
   * The route where the navigation menu item's click event will navigate the user on the website.
   */
  route: string;

  /**
   * A collection for nested child menu items.
   */
  submenu: Array<MenuItem>;
}

/**
 * The basic logic needed for nagivation menu functionalities and related data.
 */
@Injectable()
export class MenuService {
  /**
   * The shown navigation menu items.
   */
  items: Array<MenuItem>;

  /**
   * Indicates wether the navigation menu is in vertial fashion. In default its vertical.
   */
  isVertical = true;

  /**
   * Indicates wether the left side navigation menu is rendered. In default its false.
   */
  showingLeftSideMenu = false;

  /**
   * Sets the alligment of the navigation menu to vertical and toggles the visibility of the Left side menu.
   */
  toggleLeftSideMenu(): void {
    this.isVertical = true;
    this.showingLeftSideMenu = !this.showingLeftSideMenu;
  }

  /**
   * Changes the alligment of the navigation bar to its opposite.
   */
  toggleMenuOrientation() {
    this.isVertical = !this.isVertical;
  }
}
