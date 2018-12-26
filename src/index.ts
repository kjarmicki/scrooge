import * as puppeteer from 'puppeteer';
import configuration from './configuration';
import createCredentials from './credentials';
import createWfirmaPage from './pages/bookkeeping/wfirma';
import createAliorBankPage from './pages/banks/alior';

(async() => {
  const credentials = createCredentials(configuration);
  const browser = await puppeteer.launch({
    headless: false
  });
  const aliorBankPage = createAliorBankPage(await browser.newPage());
  try {
    const wasAbleToLogIn = await aliorBankPage.logIn(credentials.loginsAndPasswords('alior'));
    if (!wasAbleToLogIn) {
      console.error('Unable to login to bank page');
    }
  } catch (err) {
    console.error('Error while logging in', err);
  } finally {
    // await browser.close();
  }
})();
