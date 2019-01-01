import * as puppeteer from 'puppeteer';
import configuration from './configuration';
import createCredentials from './credentials';
import createWfirmaPage from './bookkeeping/wfirma-page';
import createAliorBankPage from './banks/alior-bank-page';

(async() => {
  const credentials = createCredentials(configuration);
  const browser = await puppeteer.launch({
    headless: false
  });
  const wfirmaPage = createWfirmaPage(await browser.newPage());
  try {
    const wasAbleToLogIn = await wfirmaPage.logIn(credentials.loginsAndPasswords('wfirma'));
    if (!wasAbleToLogIn) {
      console.error('Unable to login to wfirma page');
      return;
    }
    wfirmaPage.issueInvoice({
      buyer: {
        name: 'Silvair',
        nip: 9452164348
      },
      dates: {
        issue: new Date('2019-01-03'),
        sale: new Date('2019-01-03'),
        paid: new Date('2019-01-04')
      },
      services: [{
        name: 'robienie rzeczy',
        amount: 1,
        netAmount: 300,
        vat: 23
      }]
    });
  } catch (err) {
    console.error('Error while logging in', err);
  } finally {
    // await browser.close();
  }
})();
