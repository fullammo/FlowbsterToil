import { browser, by, element } from 'protractor';

export class FlowbsterToilPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('toil-root h1')).getText();
  }
}
