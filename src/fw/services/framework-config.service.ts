import { Injectable } from '@angular/core';

/**
 * Information of the <img> tag for social media icons.
 */
export interface IconFiles {

    /**
     * The path, where the image is located.
     */
    imageFile: string,

    /**
     * Represents the description for the image.
     */
    alt: string,

    /**
     * Represents the URL link for the actual img tag.
     */
    link: string
}

/** The basic configuration options of the layout */
export interface FrameworkConfigSettings {
    /**
     * Indicator for language selector visibility.
     */
    showLanguageSelector?: boolean,

    /**
     * Indicates wether the User based informations are shown in the layout.
     */
    showUserControls?: boolean,

    /**
     * Indicates wether the staus bar is visible.
     */
    showStatusBar?: boolean,

    /**
     * Decides at which point the status bar gets rerendered on mobile devices.
     */
    showStatusBarBreakpoint?: number,

    /**
     * A collection of social media handles (Twitter,Google etc).
     */
    socialIcons?: Array<IconFiles>
}


/**
 * Holds data and editation capabilities for the layout configuration settings.
 */
@Injectable()
export class FrameworkConfigService {

    /**
     * The language selection settings. In default its visible.
     */
    showLanguageSelector = true;

    /**
     *The User Form group visibility settings. In default its visible.
     */
    showUserControls = true;

    /**
     * The status bar visibility settings. In default its visible.
     */
    showStatusBar = true;

    /**
     * The actual status bar mobile breakpoint value. In default its zero.
     */
    showStatusBarBreakpoint = 0;

    /**
     * The used social media icons that is used in an <img> tag.
     */
    socialIcons = new Array<IconFiles>();

    /**
     * Reconfigures the actual settings of the layout.
     * @param settings The demanded Framework configuration settings object.
     */
    configure(settings: FrameworkConfigSettings) : void {
        Object.assign(this, settings);
    }

}
