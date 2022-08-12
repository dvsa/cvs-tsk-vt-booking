import { SecretsManager } from 'aws-sdk';
import { DatabaseConnectionConfig } from '../interfaces/DatabaseConnectionConfig';
import logger from './logger';

export const getOracleCredentials = async (
  secretName: string,
): Promise<DatabaseConnectionConfig> => {
  logger.debug('Retrieving secret from SecretsManager');
  const secretsManager = new SecretsManager();
  const secretValue = await secretsManager
    .getSecretValue({ SecretId: secretName })
    .promise();
  if (secretValue?.SecretString !== undefined) {
    logger.debug('Retrieved secret from SecretsManager');
    return JSON.parse(secretValue.SecretString) as DatabaseConnectionConfig;
  }
};
