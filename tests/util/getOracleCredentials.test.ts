import { SecretsManager } from 'aws-sdk';
import { getOracleCredentials } from '../../src/util/getOracleCredentials';
import logger from '../../src/util/logger';

const responses = jest.fn((SecretId) => {
  switch (SecretId) {
    case 'Success':
      return {
        SecretString: JSON.stringify({
          Database_Host: 'string',
          Database_User: 'string',
          Database_Database: 'string',
          Database_Password: 'string',
        }),
      };
    case 'NoSecret':
      return undefined;
    default:
      throw Error('Failed to get secret');
  }
});

jest.mock('aws-sdk', () => {
  return {
    config: {
      update() {
        return {};
      },
    },
    SecretsManager: jest.fn(() => {
      return {
        getSecretValue: jest.fn(({ SecretId }) => {
          return {
            promise: () => responses(SecretId),
          };
        }),
      };
    }),
  };
});

jest.mock('../../src/util/logger');

describe('getOracleCredentials', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN an invocation WHEN getting secret THEN return oracle credentials object', async () => {
    process.env.ORACLE_CONFIG_SECRET = 'SECRET';
    const result = await getOracleCredentials('Success');
    expect(responses).toHaveBeenCalledTimes(1);
    expect(responses).toHaveBeenCalledWith('Success');
    expect(Object.keys(result).length).toBe(4);
    expect.assertions(3);
  });

  it('GIVEN no secret returned WHEN getting secret THEN return nothing', async () => {
    process.env.ORACLE_CONFIG_SECRET = 'SECRET';
    const result = await getOracleCredentials('NoSecret');
    expect(responses).toHaveBeenCalledTimes(1);
    expect(responses).toHaveBeenCalledWith('NoSecret');
    expect(result).toBeUndefined();
    expect(logger.error).toHaveBeenCalledWith('Unable to retrieve secret, secretValue.SecretString was undefined');
    expect.assertions(4);
  });

  it('GIVEN an error occurs WHEN getting secret THEN throw error', async () => {
    process.env.ORACLE_CONFIG_SECRET = 'SECRET';
    await expect(getOracleCredentials('Failure')).rejects.toThrow(
      'Failed to get secret',
    );
    expect(responses).toHaveBeenCalledTimes(1);
    expect(responses).toHaveBeenCalledWith('Failure');
    expect.assertions(3);
  });
});
