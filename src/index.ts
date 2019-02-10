import * as puppeteer from 'puppeteer';
import { get as getScreenResolution } from 'screenres';
import Action from './actions/action';
import configuration from './configuration';
import createCredentials from './credentials';

(async() => {
  const [,,actionName] = process.argv;
  const actionModule = await import(`./actions/${actionName}.ts`);
  const action: Action = actionModule.default;
  const credentials = createCredentials(configuration);
  const [width, height] = getScreenResolution();
  const browser = await puppeteer.launch({
    args: [`--window-size=${width},${height}`],
    headless: false
  });
  browser.on('targetcreated', async target => {
    const page: any = await target.page();
    if (page) {
      await page._client.send('Emulation.clearDeviceMetricsOverride');
    }
  });
  await action(browser, credentials);
})();
