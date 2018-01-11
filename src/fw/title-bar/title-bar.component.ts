import { Component } from '@angular/core';

import { ScreenService } from '../services/screen.service';
import { MenuService } from '../services/menu.service';

/**
 * Holds the logic for the header display.
 */
@Component({
  selector: 'fw-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.css']
})
export class TitleBarComponent {
  /**
   * Initializes the needed services.
   */
  constructor(
    private screenService: ScreenService,
    private menuService: MenuService
  ) {}
}
