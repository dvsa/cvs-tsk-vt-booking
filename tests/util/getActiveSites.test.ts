import { getActiveSites } from '../../src/util/getActiveSites';
import logger from '../../src/util/logger';

const responses = jest.fn((SecretId) => {
  switch (SecretId) {
    case 'Success':
      return {
        SecretString: "'P12345','P123456'",
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

describe('getActiveSites', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN an invocation WHEN getting secret THEN return array6 of active sites', async () => {
    process.env.ACTIVE_SITES_SECRET_NAME = 'Success';
    delete process.env.ACTIVE_SITES;
    const result = await getActiveSites();

    expect(responses).toHaveBeenCalledTimes(1);
    expect(responses).toHaveBeenCalledWith('Success');
    expect(Object.keys(result).length).toBe(2);
    expect.assertions(3);
  });

  it('GIVEN no secret returned WHEN getting secret THEN return nothing', async () => {
    process.env.ACTIVE_SITES_SECRET_NAME = 'NoSecret';
    delete process.env.ACTIVE_SITES;

    await expect(getActiveSites()).rejects.toThrow(
      'Unable to retrieve active sites, SecretString was undefined.',
    );
    expect(responses).toHaveBeenCalledTimes(1);
    expect(responses).toHaveBeenCalledWith('NoSecret');
    expect.assertions(3);
  });

  it('GIVEN no ACTIVE_SITES_SECRET_NAME environmental variable WHEN getting secret THEN throw error', async () => {
    delete process.env.ACTIVE_SITES_SECRET_NAME;
    delete process.env.ACTIVE_SITES;

    await expect(getActiveSites()).rejects.toThrow(
      'Environment variable ACTIVE_SITES_SECRET_NAME is not set.',
    );
    expect(responses).toHaveBeenCalledTimes(0);
    expect.assertions(2);
  });

  it('GIVEN an error occurs WHEN getting secret THEN throw error', async () => {
    process.env.ACTIVE_SITES_SECRET_NAME = 'Failure';
    delete process.env.ACTIVE_SITES;

    await expect(getActiveSites()).rejects.toThrow('Failed to get secret');
    expect(responses).toHaveBeenCalledTimes(1);
    expect(responses).toHaveBeenCalledWith('Failure');
    expect.assertions(3);
  });

  it('GIVEN getActiveSites uses a cache WHEN multiple calls are made THEN all but the first will use the cache', async () => {
    process.env.ACTIVE_SITES_SECRET_NAME = 'Success';
    await getActiveSites();
    await getActiveSites();

    expect(responses).toHaveBeenCalledTimes(1);
    expect(logger.debug).toHaveBeenCalledWith(
      'Retrieved active sites from cache.',
    );
    expect.assertions(2);
  });
});
