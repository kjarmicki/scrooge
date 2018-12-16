import * as convict from 'convict';
import { config } from 'dotenv';

config();

const configuration = convict({
  loginsAndPasswords: {
    wfirma: {
      doc: 'WFirma login and password',
      env: 'SC_LAP_WFIRMA',
      default: null
    }
  }
});

export default configuration;
