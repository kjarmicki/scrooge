import { Config } from 'convict';

export type LoginAndPassword = {
  login: string;
  password: string;
};

export interface Credentials {
  loginsAndPasswords: (entity: string) => LoginAndPassword;
}

type CredentialsStorageLoginsAndPasswords = {
  [entity: string]: LoginAndPassword;
};

type CredentialsStorage = {
  loginsAndPasswords: CredentialsStorageLoginsAndPasswords;
};

type ConfigGroup = {
  [entity: string]: string
};

const LOGIN_AND_PASSWORD_SEPARATOR = '___';
function parseLoginAndPassword(rawLoginAndPassword: string): LoginAndPassword {
  const [login, password] = rawLoginAndPassword.split(LOGIN_AND_PASSWORD_SEPARATOR);
  return { login, password };
}

function buildLoginsAndPasswords(convictLoginsAndPasswords: ConfigGroup): CredentialsStorageLoginsAndPasswords {
  return Object.entries(convictLoginsAndPasswords)
    .filter(([key]) => Boolean(convictLoginsAndPasswords[key]))
    .reduce((loginsAndPasswords, [key, value]) => {
      const parsed = parseLoginAndPassword(value);
      loginsAndPasswords[key] = parsed;
      return loginsAndPasswords;
    }, {} as CredentialsStorageLoginsAndPasswords);
}

export default function createCredentials(configuration: Config<Object>): Credentials {
  const storage: CredentialsStorage = {
    loginsAndPasswords: buildLoginsAndPasswords(configuration.get('loginsAndPasswords'))
  };
  function loginsAndPasswords(entity: string): LoginAndPassword {
    const found = storage.loginsAndPasswords[entity];
    if (!found) {
      throw new Error(`Could not find login and password for ${entity}`);
    }
    return found;
  }

  return {
    loginsAndPasswords
  };
}
