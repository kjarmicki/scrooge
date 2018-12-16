import { URL } from 'url';
import { Page } from 'puppeteer';
import BookkeepingPage from './bookkeeping-page';
import { LoginAndPassword } from '../../credentials';

function url(relative: string) {
  return `https://wfirma.pl/${relative}`;
}

export default function createWfirmaPage(page: Page): BookkeepingPage {
  async function logIn({ login, password }: LoginAndPassword): Promise<boolean> {
    await page.goto(url('logowanie'));
    const inputLogin = await page.$('#UserLogin');
    const inputPassword = await page.$('#UserPassword');
    const submit = await page.$('button[type="submit"]');

    if (!inputLogin || !inputPassword || !submit) {
      throw new Error('Required elements were not found');
    }

    await inputLogin.type(login);
    await inputPassword.type(password);
    await submit.click();
    await page.waitForNavigation();

    const {href} = new URL(page.url());
    return href.endsWith('start');
  }

  return {
    logIn
  };
}
