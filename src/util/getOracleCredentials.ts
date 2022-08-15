import { SecretsManager } from 'aws-sdk';
import { DatabaseConnectionConfig } from '../interfaces/DatabaseConnectionConfig';

import logger from './logger';

export const getOracleCredentials = async (
  secretName: string,
): Promise<DatabaseConnectionConfig> => {
  if (!process.env.ORACLE_CONFIG_SECRET) {
    return {
      Database_Database: process.env.Database_Database,
      Database_User: process.env.Database_User,
      Database_Host: process.env.Database_Host,
      Database_Password: process.env.Database_Password,
    };
  }
  logger.debug('Retrieving secret from SecretsManager');
  const secretsManager = new SecretsManager();
  const secretValue = await secretsManager
    .getSecretValue({ SecretId: secretName })
    .promise();
  if (secretValue?.SecretString !== undefined) {
    logger.debug('Retrieved secret from SecretsManager');
    return JSON.parse(secretValue.SecretString) as DatabaseConnectionConfig;
  }
  logger.error(
    'Unable to retrieve secret, secretValue.SecretString was undefined',
  );
};
