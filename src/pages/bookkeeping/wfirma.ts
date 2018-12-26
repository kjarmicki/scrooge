import { URL } from 'url';
import { Page } from 'puppeteer';
import BookkeepingPage from './bookkeeping-page';
import { LoginAndPassword } from '../../credentials';
import { requireElements } from '../../utils/puppeteer';

function url(relative: string) {
  return `https://wfirma.pl/${relative}`;
}

const URLS = {
  LOGIN: {
    START: 'logowanie',
    COMPLETE: 'start'
  },
  DASHBOARD: {
    CALCULATE: {
      ZUS_DRA: (year: string | number, month: string | number) =>
        `dashboards/index/${year}/${month}`
    }
  }
};

const SELECTORS = {
  LOGIN: {
    USER: '#UserLogin',
    PASSWORD: '#UserPassword',
    SUBMIT: 'button[type=submit]'
  },
  DASHBOARD: {
    CALCULATE: {
      ZUS_DRA: 'a[href=/declaration_body_zusdra/add]'
    }
  },
  DIALOG: {
    BOX: 'ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable'
  }
};

export default function createWfirmaPage(page: Page): BookkeepingPage {
  async function logIn({ login, password }: LoginAndPassword): Promise<boolean> {
    await page.goto(url(URLS.LOGIN.START));
    const [loginUser, loginPassword, loginSubmit] = await requireElements(page,
      SELECTORS.LOGIN.USER, SELECTORS.LOGIN.PASSWORD, SELECTORS.LOGIN.SUBMIT);

    await loginUser.type(login);
    await loginPassword.type(password);
    await loginSubmit.click();
    await page.waitForNavigation();

    const {href} = new URL(page.url());
    return href.endsWith(URLS.LOGIN.COMPLETE);
  }

  async function getZusDraAmount(date: Date): Promise<number> {
    await page.goto(url(URLS.DASHBOARD.CALCULATE.ZUS_DRA(date.getFullYear(), date.getMonth() + 1)));
    const [calculateAmountButton] = await requireElements(page, SELECTORS.DASHBOARD.CALCULATE.ZUS_DRA);
    await calculateAmountButton.click();
    try {
      await page.waitForSelector(SELECTORS.DIALOG.BOX);
    } catch {
      throw new Error('Dialog box did not open');
    }
    return 0;
  }

  return {
    logIn,
    getZusDraAmount
  };
}
