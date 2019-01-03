import * as puppeteer from 'puppeteer';
import Action from './actions/action';
import configuration from './configuration';
import createCredentials from './credentials';

(async() => {
  const [,,actionName] = process.argv;
  const actionModule = await import(`./actions/${actionName}.ts`);
  const action: Action = actionModule.default;
  const credentials = createCredentials(configuration);
  const browser = await puppeteer.launch({
    headless: false
  });
  await action(browser, credentials);
})();
