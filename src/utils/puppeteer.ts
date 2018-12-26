import {Page, ElementHandle} from 'puppeteer';
import {zip} from 'lodash';

export async function requireElements(page: Page, ...selectors: string[]): Promise<ElementHandle<Element>[]> {
  const elements = await Promise.all(selectors
    .map(selector => page.$(selector)));
  for (const [element, selector] of zip(elements, selectors)) {
    if (!element) {
      throw new Error(`Could not find a required element for selector ${selector}`);
    }
  }
  return elements as ElementHandle<Element>[];
}
