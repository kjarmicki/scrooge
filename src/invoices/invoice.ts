import Company from '../companies/company';

type Vat = 'zw.' | 5 | 8 | 23;

export interface InvoiceService {
  title: string;
  count: number;
  netAmount: number;
  vat: Vat;
}

export interface Invoice {
  buyer: Company;
  dates: {
    issue: Date;
    sale: Date;
    paid: Date | undefined;
  };
  services: InvoiceService[];
}
