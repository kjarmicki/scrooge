import { Invoice } from '../invoices/invoice';
import BookkeepingPage from '../bookkeeping/bookkeeping-page';

export default async function issueInvoice(invoice: Invoice, bookkeepingPage: BookkeepingPage): Promise<boolean> {
  return bookkeepingPage.issueInvoice(invoice);
}
