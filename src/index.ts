import * as puppeteer from 'puppeteer';
import configuration from './configuration';
import createCredentials from './credentials';
import createWfirmaPage from './pages/bookkeeping/wfirma';

(async() => {
  const credentials = createCredentials(configuration);
  const browser = await puppeteer.launch({
    headless: false
  });
  const wfirmaPage = createWfirmaPage(await browser.newPage());
  try {
    const wasAbleToLogIn = await wfirmaPage.logIn(credentials.loginsAndPasswords('wfirma'));
    if (!wasAbleToLogIn) {
      console.error('Unable to login to bookkeeping page');
    }
  } catch (err) {
    console.error('Error while logging in', err);
  } finally {
    await browser.close();
  }
})();
