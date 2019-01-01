import Company from '../companies/company';

export interface InvoiceService {
  name: string;
  amount: number;
  netAmount: number;
  vat: number;
}

export default interface Invoice {
  buyer: Company;
  dates: {
    issue: Date;
    sale: Date;
    paid: Date | undefined;
  };
  services: InvoiceService[];
}
