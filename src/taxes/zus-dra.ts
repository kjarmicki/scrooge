import TaxPayment from './tax-payment';
import BookkeepingPage from '../bookkeeping/bookkeeping-page';
import BankPage from '../banks/bank-page';

export default function zusDraPayment(bankPage: BankPage, bookkeepingPage: BookkeepingPage): TaxPayment {
  function make(): Promise<boolean> {
    return Promise.resolve(true);
  }

  return {
    make
  };
}
