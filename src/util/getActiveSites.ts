import { SecretsManager } from 'aws-sdk';
import logger from './logger';

export const getActiveSites = async (): Promise<string[]> => {
  if (!process.env.ACTIVE_SITES_SECRET_NAME) {
    throw new Error(
      'Environment variable ACTIVE_SITES_SECRET_NAME is not set.',
    );
  }

  const activeSites = process.env.ACTIVE_SITES;

  if (activeSites) {
    logger.debug('Retrieved active sites from cache.');

    return activeSites.split(',');
  }

  logger.debug('Retrieving active sites from SecretsManager.');
  const secretsManager = new SecretsManager();
  const secretValue = await secretsManager
    .getSecretValue({ SecretId: process.env.ACTIVE_SITES_SECRET_NAME })
    .promise();

  if (secretValue?.SecretString !== undefined) {
    logger.debug('Retrieved active sites from SecretsManager.');
    process.env.ACTIVE_SITES = secretValue.SecretString;

    return secretValue.SecretString.split(',');
  }

  throw new Error(
    'Unable to retrieve active sites, SecretString was undefined.',
  );
};
