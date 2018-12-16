import { LoginAndPassword } from '../../credentials';

export default interface BookkeepingPage {
  logIn: (loginAndPassword: LoginAndPassword) => Promise<boolean>;
}
