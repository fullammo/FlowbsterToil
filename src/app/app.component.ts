import { Component } from '@angular/core';

import {
  FrameworkConfigService,
  FrameworkConfigSettings
} from '../fw/services/framework-config.service';
import { MenuService } from '../fw/services/menu.service';

import * as jsyaml from 'js-yaml';
import { initialMenuItems } from 'app/core/models/app.menu';

/**
 * The Main component for the application.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /**
   * Initialize the needed services and sets the layout configuration and menu items.
   */
  constructor(
    private frameworkConfigService: FrameworkConfigService,
    private menuService: MenuService
  ) {
    const config: FrameworkConfigSettings = {
      socialIcons: [
        {
          imageFile: 'assets/social-fb-bw.png',
          alt: 'Facebook',
          link: 'http://www.facebook.com'
        },
        {
          imageFile: 'assets/social-google-bw.png',
          alt: 'Google +',
          link: 'http://www.google.com'
        },
        {
          imageFile: 'assets/social-twitter-bw.png',
          alt: 'Twitter',
          link: 'http://www.twitter.com'
        }
      ],
      showLanguageSelector: true,
      showUserControls: true,
      showStatusBar: true,
      showStatusBarBreakpoint: 800
    };

    frameworkConfigService.configure(config);

    menuService.items = initialMenuItems;
  }
}
