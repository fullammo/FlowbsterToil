import { FlowbsterToilPage } from './app.po';

describe('flowbster-toil App', () => {
  let page: FlowbsterToilPage;

  beforeEach(() => {
    page = new FlowbsterToilPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to toil!!');
  });
});
