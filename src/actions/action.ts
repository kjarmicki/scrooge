import { Browser } from 'puppeteer';
import { Credentials } from '../credentials';

export default interface Action {
  (browser: Browser, credentials: Credentials): Promise<void>;
}
