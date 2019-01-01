import { URL } from 'url';
import * as assert from 'assert';
import { Page, ElementHandle } from 'puppeteer';
import Invoice from '../invoices/invoice';
import BookkeepingPage from './bookkeeping-page';
import { LoginAndPassword } from '../credentials';
import { requireElements, waitForSelector } from '../utils/puppeteer';

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
  },
  INVOICES: {
    LIST: 'invoices/index/all'
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
    BOX: '.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable',
    AUTOCOMPLETE: {
      FIRST_ITEM: '.ui-autocomplete.ui-menu li:first-child a'
    },
    INVOICE: {
      BUYER: '#ContractorDetailName',
      DATES: {
        ISSUE: '#InvoiceDate',
        SALE: '#InvoiceDisposaldate',
        PAYMENT: '#InvoicePaymentdate',
        PAID: '#PaymentDate'
      },
      OPTIONS: {
        PAID: '#InvoiceAlreadypaidInitial ~ .check-box'
      }
    }
  },
  TABLE: {
    HEADER: {
      INVOICE: {
        NEW: '.navbar-menu.actions-table li ul li a'
      }
    },
    DATE: {
      YEAR: {
        OPTION: (year: string) => `select.year ~ div .dropdown-menu a[data-text="${year}"]`
      },
      MONTH: {
        OPTION: (month: string) => `select.month ~ div .dropdown-menu li:nth-child(${month}) a`
      }
    }
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

    const {pathname} = new URL(page.url());
    return pathname.endsWith(URLS.LOGIN.COMPLETE);
  }

  async function getZusDraAmount(date: Date): Promise<number> {
    await page.goto(url(URLS.DASHBOARD.CALCULATE.ZUS_DRA(date.getFullYear(), date.getMonth() + 1)));
    const [calculateAmountButton] = await requireElements(page, SELECTORS.DASHBOARD.CALCULATE.ZUS_DRA);
    await calculateAmountButton.click();
    await waitForSelector(page, SELECTORS.DIALOG.BOX);
    return 0;
  }

  async function issueInvoice(invoice: Invoice): Promise<boolean> {
    await page.goto(url(URLS.INVOICES.LIST));
    page.waitFor(500);
    await selectTableDate(invoice.dates.issue);
    await openIssueInvoiceDialog();
    await selectExistingBuyer(invoice);
    await fillInInvoiceDates(invoice);
    // TODO: services
    return true;
  }

  async function selectTableDate(date: Date): Promise<void> {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 2).toString();
    await page.evaluate((yearOptionSelector, monthOptionSelector) => {
      document.querySelector(yearOptionSelector).click();
      document.querySelector(monthOptionSelector).click();
    }, SELECTORS.TABLE.DATE.YEAR.OPTION(year), SELECTORS.TABLE.DATE.MONTH.OPTION(month));
  }

  async function openIssueInvoiceDialog(): Promise<void> {
    await page.evaluate((invoiceNewSelector) => {
      document.querySelector(invoiceNewSelector).click();
    }, SELECTORS.TABLE.HEADER.INVOICE.NEW);
    await waitForSelector(page, SELECTORS.DIALOG.BOX);
  }

  async function selectExistingBuyer(invoice: Invoice): Promise<void> {
    const [invoiceBuyerInput] = await requireElements(page, SELECTORS.DIALOG.INVOICE.BUYER);
    await invoiceBuyerInput.type(invoice.buyer.nip.toString());
    await waitForSelector(page, SELECTORS.DIALOG.AUTOCOMPLETE.FIRST_ITEM);
    const [autocompleteFirstItem] = await requireElements(page, SELECTORS.DIALOG.AUTOCOMPLETE.FIRST_ITEM);
    await autocompleteFirstItem.click();
    const actualName: string = await page.evaluate((invoiceBuyerSelector) => {
      return document.querySelector(invoiceBuyerSelector).value;
    }, SELECTORS.DIALOG.INVOICE.BUYER);
    assert.ok(actualName.includes(invoice.buyer.name),
      `Company name on invoice (${invoice.buyer.name}) doesn't match the first selection (${actualName})`);
  }

  async function fillInInvoiceDates(invoice: Invoice): Promise<void> {
    const {ISSUE, SALE, PAYMENT, PAID} = SELECTORS.DIALOG.INVOICE.DATES;
    if (invoice.dates.paid) {
      await tickInvoicePaid();
      await fillInDate(PAID, invoice.dates.paid);
    }
    await fillInDate(ISSUE, invoice.dates.issue);
    await fillInDate(SALE, invoice.dates.sale);
    await fillInDate(PAYMENT, invoice.dates.paid || invoice.dates.sale);
  }

  async function tickInvoicePaid(): Promise<void> {
    await page.evaluate((optionPaidSelector) => {
      document.querySelector(optionPaidSelector).click();
    }, SELECTORS.DIALOG.INVOICE.OPTIONS.PAID);
    await waitForSelector(page, SELECTORS.DIALOG.INVOICE.DATES.PAID);
  }

  async function fillInDate(inputSelector: string, dateToFillIn: Date): Promise<void> {
    const inputValue = [dateToFillIn.getFullYear(),
      (dateToFillIn.getMonth() + 1).toString().padStart(2, '0'),
      dateToFillIn.getDate().toString().padStart(2, '0')].join('-');
    await page.evaluate((inputSelector, inputValue) => {
      document.querySelector(inputSelector).value = inputValue;
    }, inputSelector, inputValue);
  }

  return {
    logIn,
    getZusDraAmount,
    issueInvoice
  };
}
