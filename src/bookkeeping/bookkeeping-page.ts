import { LoginAndPassword } from '../credentials';
import { Invoice } from '../invoices/invoice';
import { InternalProof } from '../incomes/internal-proof';

export default interface BookkeepingPage {
  logIn: (loginAndPassword: LoginAndPassword) => Promise<boolean>;
  getZusDraAmount: (date: Date) => Promise<number>;
  issueInvoice: (invoice: Invoice) => Promise<boolean>;
  addInternalProof: (internalProof: InternalProof) => Promise<boolean>;
}
