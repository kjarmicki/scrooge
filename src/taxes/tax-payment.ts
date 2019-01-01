export default interface TaxPayment {
  make: () => Promise<boolean>;
}
