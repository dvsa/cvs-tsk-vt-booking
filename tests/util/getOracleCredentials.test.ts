import { SecretsManager } from 'aws-sdk';
import { getOracleCredentials } from '../../src/util/getOracleCredentials';

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

describe('getOracleCredentials', () => {
  it('GIVEN an invocation WHEN getting secret THEN return oracle credentials object', async () => {
    const result = await getOracleCredentials('Success');
    expect(Object.keys(result).length).toBe(4);
  });
  it('GIVEN an error occurs WHEN getting secret THEN throw error', async () => {
    await expect(getOracleCredentials('Failure')).rejects.toThrow(
      'Failed to get secret',
    );
  });
});
