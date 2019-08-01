import { newE2EPage } from '@stencil/core/testing';

describe('my-component', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<keyframed-audio-player></keyframed-audio-player>');
    const element = await page.find('keyframed-audio-player');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<keyframed-audio-player></keyframed-audio-player>');
    const component = await page.find('keyframed-audio-playert');
    const element = await page.find('keyframed-audio-playert >>> div');
    expect(element.textContent).toEqual(`Hello, World! I'm `);

    component.setProperty('name', 'Song Title');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Song Title`);
  });
});
