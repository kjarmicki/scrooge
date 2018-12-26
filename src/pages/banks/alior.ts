import { URL } from 'url';
import { Page } from 'puppeteer';
import BankPage from './bank-page';
import { LoginAndPassword } from '../../credentials';
import { requireElements } from '../../utils//puppeteer';

function url(relative: string): string {
  return `https://system.aliorbank.pl/${relative}`;
}

const URLS = {
  LOGIN: {
    START: 'sign-in',
    COMPLETE: 'dashboard'
  }
};

const SELECTORS = {
  LOGIN: {
    INPUT: '#login',
    SUBMIT: 'button[type=submit]'
  },
  PASSWORD: {
    LETTER: '.field [tabindex] + input',
    SUBMIT: '#password-submit'
  }
};

export default function createAliorBankPage(page: Page): BankPage {
  async function logIn({login, password}: LoginAndPassword): Promise<boolean> {
    await page.goto(url(URLS.LOGIN.START));

    const [loginInput, loginSubmit] = await requireElements(page, SELECTORS.LOGIN.INPUT, SELECTORS.LOGIN.SUBMIT);
    await loginInput.type(login);
    await loginSubmit.click();
    await page.waitForNavigation({
      waitUntil: 'networkidle0'
    });

    const [passwordSubmit] = await requireElements(page, SELECTORS.PASSWORD.SUBMIT);
    await typeInPassword(password);
    await passwordSubmit.click();
    await page.waitForNavigation({
      waitUntil: 'domcontentloaded'
    });

    const {href} = new URL(page.url());
    return href.endsWith(URLS.LOGIN.COMPLETE);
  }

  async function typeInPassword(password: string): Promise<void> {
    const passwordLetters = await page.$(SELECTORS.PASSWORD.LETTER);
    if (!passwordLetters) {
      throw new Error('Could not find password letter inputs');
    }
    const splitPassword = password.split('');

    const letterIndexes = await page.evaluate((selectorPasswordLetters) => {
      return Array.from(document.querySelectorAll(selectorPasswordLetters))
        .map(input => input.getAttribute('name') || '')
        .map(nameAttribute => nameAttribute.replace('masked[', '').replace(']', ''))
        .map(indexAsString => parseInt(indexAsString, 10))
        .filter(index => !Number.isNaN(index))
        .map(index => index - 1);
    }, SELECTORS.PASSWORD.LETTER);

    await passwordLetters.focus();
    for (const index of letterIndexes) {
      await page.waitFor(500);
      await page.keyboard.press(splitPassword[index]);
    }
  }

  return {
    logIn
  };
}
