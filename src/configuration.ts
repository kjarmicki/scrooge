import * as convict from 'convict';
import { config } from 'dotenv';

config();

const configuration = convict({
  loginsAndPasswords: {
    wfirma: {
      doc: 'WFirma login and password',
      env: 'SC_LAP_WFIRMA',
      default: null
    },
    alior: {
      doc: 'Alior bank login and password',
      env: 'SC_LAP_ALIOR',
      default: null
    }
  }
});

export default configuration;
