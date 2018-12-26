import { LoginAndPassword } from '../../credentials';

export default interface BankPage {
  logIn: (loginAndPassword: LoginAndPassword) => Promise<boolean>;
}
