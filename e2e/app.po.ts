import { browser, by, element } from 'protractor';

/**
 * Represents the Flowbster Toil platform page in Selenium environment.
 */
export class FlowbsterToilPage {

  /**
   * Navigates to the index page of the platform.
   */
  navigateTo() {
    return browser.get('/');
  }

  /**
   * Gets the text from the main components selector.
   */
  getParagraphText() {
    return element(by.css('toil-root h1')).getText();
  }
}
